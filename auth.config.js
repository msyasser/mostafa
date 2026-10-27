import { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import crypto from "crypto";
import { isAllowedRedirectHost, isSameSitePath } from "@/src/lib/redirect";
import { verifyToken } from "@/src/lib/email";
import {
  hashPassword,
  verifyPassword,
  needsRehash,
  findPasswordPropertyName,
} from "@/src/lib/password";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";
import { isValidEmail, normalizeEmail } from "@/src/lib/validation";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_USERS_DB_ID = process.env.NOTION_USERS_DB_ID;

const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 200;
const MAX_NAME_LENGTH = 100;
const MAX_PHONE_LENGTH = 30;

const LOGIN_WINDOW_MS = 15 * 60 * 1000;
const VERIFY_WINDOW_MS = 10 * 60 * 1000;

// Fallback in-memory storage if Notion is not available
let users = [];

function notionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  };
}

async function getNotionDatabaseSchema() {
  if (!NOTION_TOKEN || !NOTION_USERS_DB_ID) {
    console.error('❌ Missing Notion credentials');
    return null;
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}`, {
      method: 'GET',
      headers: notionHeaders(),
    });

    if (!response.ok) {
      console.error('❌ Notion API error response:', {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error('❌ Failed to fetch Notion database:', error.message);
    return null;
  }
}

async function createUserInNotion({ name, email, password, phone }) {
  if (!NOTION_TOKEN || !NOTION_USERS_DB_ID) {
    throw new Error("Notion credentials not configured");
  }

  // Get database schema to use exact property names
  const dbSchema = await getNotionDatabaseSchema();
  if (!dbSchema) {
    throw new Error("Could not access Notion database. Please check sharing permissions.");
  }

  // Find the actual property names in your database
  const properties = dbSchema.properties;

  // Build properties object dynamically based on what exists
  const userProperties = {};

  // Look for Name/Title property (required)
  const nameProp = Object.keys(properties).find(p => properties[p].type === 'title');
  if (!nameProp) {
    throw new Error("Database must have a Title property for user names");
  }
  userProperties[nameProp] = { title: [{ text: { content: name } }] };

  // Look for Email property (required)
  const emailProp = Object.keys(properties).find(p => properties[p].type === 'email');
  if (!emailProp) {
    throw new Error("Database must have an Email property");
  }
  userProperties[emailProp] = { email: email };

  // Look for Password property - prioritize by name first, then by type
  const passwordProp = findPasswordPropertyName(properties);
  if (passwordProp) {
    userProperties[passwordProp] = {
      rich_text: [{ text: { content: await hashPassword(password) } }],
    };
  } else {
    console.warn('⚠️ No password property found in database');
  }

  // Look for Phone property
  const phoneProp = Object.keys(properties).find(p => properties[p].type === 'phone_number');
  if (phoneProp && phone) {
    // Remove any spaces or special formatting from phone number
    const cleanPhone = phone.replace(/\s+/g, '');
    userProperties[phoneProp] = { phone_number: cleanPhone };
  }

  // Look for Date property (for registration date)
  const dateProp = Object.keys(properties).find(p =>
    properties[p].type === 'date' &&
    (p.toLowerCase().includes('date') || p.toLowerCase().includes('created') || p.toLowerCase().includes('registered'))
  );
  if (dateProp) {
    userProperties[dateProp] = { date: { start: new Date().toISOString().split('T')[0] } };
  }

  const response = await fetch(`https://api.notion.com/v1/pages`, {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { database_id: NOTION_USERS_DB_ID },
      properties: userProperties,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // Never log the request body: it contains the password hash and PII.
    console.error('❌ Notion API error response:', {
      status: response.status,
      statusText: response.statusText,
      code: error.code,
      message: error.message,
    });
    throw new Error("Failed to create user in Notion");
  }

  return await response.json();
}

async function queryUserByEmail(emailProp, email) {
  const response = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}/query`,
    {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify({
        filter: {
          property: emailProp,
          email: { equals: email },
        },
      }),
    }
  );

  if (!response.ok) {
    console.error('Notion query error:', response.status);
    return null;
  }

  const data = await response.json();
  return data.results[0] || null;
}

async function findUserByEmail(email) {
  if (!NOTION_TOKEN || !NOTION_USERS_DB_ID) {
    return null;
  }

  // Get database schema to find email property name
  const dbSchema = await getNotionDatabaseSchema();
  if (!dbSchema) {
    return null;
  }

  const properties = dbSchema.properties;
  const emailProp = Object.keys(properties).find(p => properties[p].type === 'email');

  if (!emailProp) {
    console.error('Could not find email property in database');
    return null;
  }

  const trimmed = email.trim();
  const found = await queryUserByEmail(emailProp, trimmed);
  if (found) return found;

  // Older accounts may have been stored with the casing the user typed
  const lowered = normalizeEmail(email);
  return lowered !== trimmed ? queryUserByEmail(emailProp, lowered) : null;
}

// Accounts created before salted hashing hold an unsalted SHA-256 digest. After
// a successful login, silently replace it with a salted scrypt hash.
async function upgradePasswordHash(pageId, propertyName, password) {
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: notionHeaders(),
      body: JSON.stringify({
        properties: {
          [propertyName]: { rich_text: [{ text: { content: await hashPassword(password) } }] },
        },
      }),
    });

    if (!response.ok) {
      console.error('Password hash upgrade failed:', response.status);
    }
  } catch (error) {
    console.error('Password hash upgrade failed:', error.message);
  }
}

// A plain Error thrown from authorize() ends up on Auth.js's "Configuration" error
// page. CredentialsSignin is returned to signIn() instead, with `code` identifying
// the failure so the form can show a proper message (see src/lib/auth-errors.js).
class CredentialsError extends CredentialsSignin {
  constructor(code) {
    super();
    this.code = code;
  }
}

const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
// Share the session across *.mostafayasser.com only on the production deployment.
// A cookie whose Domain doesn't match the host is dropped by the browser, which
// makes sign-in fail with MissingCSRF on *.vercel.app preview deployments.
const cookieDomain =
  process.env.NODE_ENV === "production" && process.env.VERCEL_ENV !== "preview"
    ? ".mostafayasser.com"
    : undefined;

export const authConfig = {
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: cookieDomain,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}authjs.callback-url`,
      options: {
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: cookieDomain,
      },
    },
    csrfToken: {
      name: `${cookiePrefix}authjs.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        domain: cookieDomain,
      },
    },
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        name: { label: "Name", type: "text" },
        phone: { label: "Phone", type: "text" },
        action: { label: "Action", type: "text" },
        verificationToken: { label: "Verification Token", type: "text" },
        verificationCode: { label: "Verification Code", type: "text" },
      },
      async authorize(credentials, request) {
        if (!credentials) {
          return null;
        }

        const { password, name, phone, action, verificationToken, verificationCode } = credentials;
        const email = typeof credentials.email === "string" ? credentials.email.trim() : "";

        if (!email || !password) {
          throw new CredentialsError("missing_fields");
        }

        if (typeof password !== "string" || password.length > MAX_PASSWORD_LENGTH) {
          throw new CredentialsError("invalid_credentials");
        }

        const ip = getClientIp(request?.headers);

        // For signup
        if (action === "signup") {
          if (!isValidEmail(email)) {
            throw new CredentialsError("invalid_email");
          }

          if (typeof name !== "string" || !name.trim() || name.trim().length > MAX_NAME_LENGTH) {
            throw new CredentialsError("name_required");
          }

          if (password.length < MIN_PASSWORD_LENGTH) {
            throw new CredentialsError("password_too_short");
          }

          // Email verification is mandatory: without it anyone could register
          // an address they don't own.
          if (typeof verificationToken !== "string" || typeof verificationCode !== "string" ||
              !verificationToken || !verificationCode) {
            throw new CredentialsError("verification_required");
          }

          const normalizedEmail = normalizeEmail(email);

          // The code is only 6 digits, so cap how many guesses one address gets.
          const attempts = rateLimit(`verify:${normalizedEmail}`, { limit: 5, windowMs: VERIFY_WINDOW_MS });
          const ipAttempts = rateLimit(`verify-ip:${ip}`, { limit: 20, windowMs: VERIFY_WINDOW_MS });
          if (!attempts.ok || !ipAttempts.ok) {
            throw new CredentialsError("too_many_attempts");
          }

          const verification = verifyToken(verificationToken, normalizedEmail, verificationCode);
          if (!verification.valid) {
            throw new CredentialsError(
              verification.error === "Verification code has expired" ? "verification_expired" : "verification_invalid"
            );
          }

          const cleanName = name.trim();
          const cleanPhone = typeof phone === "string" ? phone.trim().slice(0, MAX_PHONE_LENGTH) : "";

          // Try Notion first, fallback to in-memory
          let newUser;

          if (NOTION_TOKEN && NOTION_USERS_DB_ID) {
            // Check if user exists in Notion
            const existingUser = await findUserByEmail(normalizedEmail);
            if (existingUser) {
              throw new CredentialsError("user_exists");
            }

            try {
              // Create user in Notion
              const notionUser = await createUserInNotion({
                name: cleanName,
                email: normalizedEmail,
                password,
                phone: cleanPhone,
              });

              newUser = {
                id: notionUser.id,
                name: cleanName,
                email: normalizedEmail,
              };
            } catch (error) {
              console.error('❌ Notion signup error:', error.message);
              throw new CredentialsError("signup_failed");
            }
          } else {
            // Fallback to in-memory storage
            const existingUser = users.find(u => u.email === normalizedEmail);
            if (existingUser) {
              throw new CredentialsError("user_exists");
            }

            newUser = {
              id: Date.now().toString(),
              name: cleanName,
              email: normalizedEmail,
              password: await hashPassword(password),
              createdAt: new Date().toISOString(),
            };

            users.push(newUser);
          }

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          };
        }

        // For login
        if (action === "login") {
          const byIp = rateLimit(`login-ip:${ip}`, { limit: 30, windowMs: LOGIN_WINDOW_MS });
          const byPair = rateLimit(`login:${ip}:${normalizeEmail(email)}`, { limit: 8, windowMs: LOGIN_WINDOW_MS });
          if (!byIp.ok || !byPair.ok) {
            throw new CredentialsError("too_many_attempts");
          }

          let user = null;

          if (NOTION_TOKEN && NOTION_USERS_DB_ID) {
            const notionUser = await findUserByEmail(email);

            if (!notionUser) {
              throw new CredentialsError("invalid_credentials");
            }

            // Resolve property keys dynamically
            const props = notionUser.properties || {};
            const propKeys = Object.keys(props);
            const titleKey = propKeys.find(k => props[k]?.type === 'title');
            const emailKey = propKeys.find(k => props[k]?.type === 'email');
            const passwordKey = findPasswordPropertyName(props);

            // Extract stored password safely
            const storedPassword = passwordKey
              ? (props[passwordKey].rich_text?.[0]?.text?.content ?? props[passwordKey].text?.[0]?.text?.content)
              : undefined;

            if (!storedPassword || !(await verifyPassword(password, storedPassword))) {
              throw new CredentialsError("invalid_credentials");
            }

            if (needsRehash(storedPassword)) {
              await upgradePasswordHash(notionUser.id, passwordKey, password);
            }

            user = {
              id: notionUser.id,
              name: titleKey ? (props[titleKey]?.title?.[0]?.text?.content || name) : name,
              email: emailKey ? (props[emailKey]?.email || email) : email,
            };
          } else {
            // Fallback to in-memory storage
            const inMemoryUser = users.find(u => u.email === normalizeEmail(email));

            if (!inMemoryUser || !(await verifyPassword(password, inMemoryUser.password))) {
              throw new CredentialsError("invalid_credentials");
            }

            user = {
              id: inMemoryUser.id,
              name: inMemoryUser.name,
              email: inMemoryUser.email,
            };
          }

          return user;
        }

        return null;
      },
    }),
    // Sessions are JWT-only (no adapter), so there are no stored accounts to
    // link and allowDangerousEmailAccountLinking is deliberately not enabled.
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative paths
      if (isSameSitePath(url)) {
        return `${baseUrl}${url}`;
      }
      try {
        const parsed = new URL(url);
        const isLocalDev = process.env.NODE_ENV !== "production" && parsed.hostname === "localhost";
        if (
          (parsed.protocol === "https:" || (isLocalDev && parsed.protocol === "http:")) &&
          isAllowedRedirectHost(parsed.hostname)
        ) {
          return url;
        }
      } catch {
        // fallback to baseUrl on malformed URL
      }
      return baseUrl;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        // Only trust Google identities whose email Google has verified
        if (profile?.email_verified === false) {
          return false;
        }

        const email = user?.email;
        const name = user?.name || "Google User";

        if (NOTION_TOKEN && NOTION_USERS_DB_ID && email) {
          try {
            const existingUser = await findUserByEmail(email);
            if (!existingUser) {
              await createUserInNotion({
                name,
                email: normalizeEmail(email),
                password: crypto.randomBytes(16).toString("hex"),
                phone: "",
              });
            }
          } catch (err) {
            console.error("❌ Error syncing Google user to Notion:", err.message);
          }
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || token.sub;
        token.email = user.email;
        token.name = user.name;
        if (user.image) {
          token.picture = user.image;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        if (token.picture) {
          session.user.image = token.picture;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/en/auth/signin",
  },
  // No hardcoded fallback in production: Auth.js refuses to run without a secret.
  secret:
    process.env.NEXTAUTH_SECRET ||
    process.env.AUTH_SECRET ||
    (process.env.NODE_ENV === "production" ? undefined : "dev-only-insecure-secret"),
};
