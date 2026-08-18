import { NextResponse } from "next/server";
import { auth } from "@/src/app/api/auth/[...nextauth]/route";
import crypto from "crypto";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_USERS_DB_ID = process.env.NOTION_USERS_DB_ID;

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

async function findUserInNotion(email) {
  if (!NOTION_TOKEN || !NOTION_USERS_DB_ID || !email) return null;

  try {
    // 1. Get database schema to find email property name
    const schemaRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
    });

    if (!schemaRes.ok) return null;
    const schema = await schemaRes.json();
    const properties = schema.properties || {};
    const emailProp = Object.keys(properties).find((p) => properties[p].type === "email");
    if (!emailProp) return null;

    // 2. Query for user by email
    const queryRes = await fetch(`https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${NOTION_TOKEN}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
      },
      body: JSON.stringify({
        filter: {
          property: emailProp,
          email: { equals: email },
        },
      }),
    });

    if (!queryRes.ok) return null;
    const data = await queryRes.json();
    return {
      userPage: data.results?.[0] || null,
      propertiesSchema: properties,
    };
  } catch (err) {
    console.error("Error finding user in Notion:", err);
    return null;
  }
}

export async function GET() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = session.user.email;
  let phone = "";
  let name = session.user.name || "";
  let createdAt = null;

  const result = await findUserInNotion(email);
  if (result && result.userPage) {
    const props = result.userPage.properties || {};

    const nameKey = Object.keys(props).find((k) => props[k]?.type === "title");
    const phoneKey = Object.keys(props).find((k) => props[k]?.type === "phone_number");
    const dateKey = Object.keys(props).find(
      (k) =>
        props[k]?.type === "date" &&
        (k.toLowerCase().includes("date") || k.toLowerCase().includes("created") || k.toLowerCase().includes("registered"))
    );

    if (nameKey && props[nameKey]?.title?.[0]?.text?.content) {
      name = props[nameKey].title[0].text.content;
    }
    if (phoneKey && props[phoneKey]?.phone_number) {
      phone = props[phoneKey].phone_number;
    }
    if (dateKey && props[dateKey]?.date?.start) {
      createdAt = props[dateKey].date.start;
    }
    if (!createdAt && result.userPage.created_time) {
      createdAt = result.userPage.created_time.split("T")[0];
    }
  }

  return NextResponse.json({
    user: {
      name,
      email,
      phone,
      createdAt: createdAt || new Date().toISOString().split("T")[0],
      isGoogleUser: !!session.user.image,
    },
  });
}

export async function PATCH(request) {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, phone, currentPassword, newPassword } = body;
    const email = session.user.email;

    const result = await findUserInNotion(email);
    if (!result || !result.userPage) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    const { userPage, propertiesSchema } = result;
    const props = userPage.properties || {};
    const updatedProps = {};

    // 1. Update Name if provided
    if (typeof name === "string" && name.trim()) {
      const nameKey = Object.keys(propertiesSchema).find((k) => propertiesSchema[k].type === "title");
      if (nameKey) {
        updatedProps[nameKey] = {
          title: [{ text: { content: name.trim() } }],
        };
      }
    }

    // 2. Update Phone if provided
    if (typeof phone === "string") {
      const phoneKey = Object.keys(propertiesSchema).find((k) => propertiesSchema[k].type === "phone_number");
      if (phoneKey) {
        const cleanPhone = phone.replace(/\s+/g, "");
        updatedProps[phoneKey] = {
          phone_number: cleanPhone || null,
        };
      }
    }

    // 3. Update Password if provided
    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }

      // Check current password
      const passwordKey = Object.keys(props).find(
        (k) =>
          props[k]?.type === "rich_text" ||
          props[k]?.type === "text" ||
          k.toLowerCase().includes("password")
      );

      if (passwordKey) {
        const storedPassword =
          props[passwordKey]?.rich_text?.[0]?.text?.content ||
          props[passwordKey]?.text?.[0]?.text?.content;

        if (storedPassword && storedPassword !== hashPassword(currentPassword || "")) {
          return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }

        const propType = propertiesSchema[passwordKey]?.type === "rich_text" ? "rich_text" : "text";
        updatedProps[passwordKey] = {
          [propType]: [{ text: { content: hashPassword(newPassword) } }],
        };
      }
    }

    // Perform update in Notion
    if (Object.keys(updatedProps).length > 0) {
      const updateRes = await fetch(`https://api.notion.com/v1/pages/${userPage.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          properties: updatedProps,
        }),
      });

      if (!updateRes.ok) {
        const errJson = await updateRes.json().catch(() => ({}));
        console.error("Failed to update user in Notion:", errJson);
        return NextResponse.json({ error: "Failed to update profile in Notion" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        name: name || session.user.name,
        phone: phone,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session || !session.user || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const email = session.user.email;
    const result = await findUserInNotion(email);

    if (result && result.userPage) {
      // Archive/delete the user page in Notion
      const deleteRes = await fetch(`https://api.notion.com/v1/pages/${result.userPage.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Content-Type": "application/json",
          "Notion-Version": "2022-06-28",
        },
        body: JSON.stringify({
          archived: true,
        }),
      });

      if (!deleteRes.ok) {
        console.error("Failed to archive user in Notion:", await deleteRes.json().catch(() => ({})));
        return NextResponse.json({ error: "Failed to delete account in database" }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("Account deletion error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

