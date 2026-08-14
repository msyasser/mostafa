import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import crypto from "crypto";
import { verifyToken } from "@/src/lib/email";

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_USERS_DB_ID = process.env.NOTION_USERS_DB_ID;

// Simple password hashing function
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Fallback in-memory storage if Notion is not available
let users = [];

async function getNotionDatabaseSchema() {
  if (!NOTION_TOKEN || !NOTION_USERS_DB_ID) {
    console.error('❌ Missing Notion credentials:', {
      hasToken: !!NOTION_TOKEN,
      hasDbId: !!NOTION_USERS_DB_ID,
      tokenPrefix: NOTION_TOKEN ? NOTION_TOKEN.substring(0, 10) : 'none'
    });
    return null;
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorJson;
      try {
        errorJson = JSON.parse(errorText);
      } catch (e) {
        errorJson = { raw: errorText };
      }
      
      console.error('❌ Notion API error response:', {
        status: response.status,
        statusText: response.statusText,
        error: errorJson,
        dbId: NOTION_USERS_DB_ID,
        tokenLength: NOTION_TOKEN?.length
      });
      return null;
    }

    const schema = await response.json();
    console.log('✅ Successfully accessed Notion database:', {
      dbId: NOTION_USERS_DB_ID,
      dbTitle: schema.title?.[0]?.plain_text || 'Unknown',
      properties: Object.keys(schema.properties || {})
    });
    return schema;
  } catch (error) {
    console.error('❌ Failed to fetch Notion database:', {
      message: error.message,
      dbId: NOTION_USERS_DB_ID
    });
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
  console.log('📋 Available properties in your database:', Object.keys(properties));
  console.log('📋 Property types:', Object.entries(properties).map(([key, value]) => `${key}: ${value.type}`));

  // Build properties object dynamically based on what exists
  const userProperties = {};
  
  // Look for Name/Title property (required)
  const nameProp = Object.keys(properties).find(p => properties[p].type === 'title');
  if (!nameProp) {
    throw new Error("Database must have a Title property for user names");
  }
  userProperties[nameProp] = { title: [{ text: { content: name } }] };
  console.log(`✅ Found name property: "${nameProp}"`);

  // Look for Email property (required)
  const emailProp = Object.keys(properties).find(p => properties[p].type === 'email');
  if (!emailProp) {
    throw new Error("Database must have an Email property");
  }
  userProperties[emailProp] = { email: email };
  console.log(`✅ Found email property: "${emailProp}"`);

  // Look for Password property - prioritize by name first, then by type
  let passwordProp = Object.keys(properties).find(p => 
    p.toLowerCase().includes('password') && 
    (properties[p].type === 'rich_text' || properties[p].type === 'text')
  );
  
  // If not found by name, find any rich_text or text property
  if (!passwordProp) {
    passwordProp = Object.keys(properties).find(p => 
      properties[p].type === 'rich_text' || properties[p].type === 'text'
    );
  }
  
  if (passwordProp) {
    userProperties[passwordProp] = { 
      [properties[passwordProp].type === 'rich_text' ? 'rich_text' : 'text']: [{ 
        text: { content: hashPassword(password) } 
      }] 
    };
    console.log(`✅ Found password property: "${passwordProp}"`);
  } else {
    console.warn('⚠️ No password property found in database');
  }

  // Look for Phone property
  const phoneProp = Object.keys(properties).find(p => properties[p].type === 'phone_number');
  if (phoneProp && phone) {
    // Remove any spaces or special formatting from phone number
    const cleanPhone = phone.replace(/\s+/g, '');
    userProperties[phoneProp] = { phone_number: cleanPhone };
    console.log(`✅ Found phone property: "${phoneProp}"`);
  }

  // Look for Date property (for registration date)
  const dateProp = Object.keys(properties).find(p => 
    properties[p].type === 'date' && 
    (p.toLowerCase().includes('date') || p.toLowerCase().includes('created') || p.toLowerCase().includes('registered'))
  );
  if (dateProp) {
    userProperties[dateProp] = { date: { start: new Date().toISOString().split('T')[0] } };
    console.log(`✅ Found date property: "${dateProp}"`);
  }

  console.log('📝 Creating user with properties:', Object.keys(userProperties));
  console.log('📝 Properties data:', JSON.stringify(userProperties, null, 2));

  const response = await fetch(`https://api.notion.com/v1/pages`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: NOTION_USERS_DB_ID },
      properties: userProperties,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let error;
    try {
      error = JSON.parse(errorText);
    } catch (e) {
      error = { raw: errorText };
    }
    console.error('❌ Notion API error response:', {
      status: response.status,
      statusText: response.statusText,
      error: error,
      propertiesSent: Object.keys(userProperties),
      propertiesData: userProperties
    });
    throw new Error(`Failed to create user in Notion: ${error.message || response.statusText}`);
  }

  const result = await response.json();
  console.log('✅ Successfully created user in Notion:', result.id);
  return result;
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

  const response = await fetch(
    `https://api.notion.com/v1/databases/${NOTION_USERS_DB_ID}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${NOTION_TOKEN}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28',
      },
      body: JSON.stringify({
        filter: {
          property: emailProp,
          email: { equals: email },
        },
      }),
    }
  );

  if (!response.ok) {
    console.error('Notion query error:', await response.json());
    return null;
  }

  const data = await response.json();
  return data.results[0];
}

const useSecureCookies = process.env.NODE_ENV === "production";
const cookiePrefix = useSecureCookies ? "__Secure-" : "";
const cookieDomain = process.env.NODE_ENV === "production" ? ".mostafayasser.com" : undefined;

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
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { email, password, name, phone, action, verificationToken, verificationCode } = credentials;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // For signup
        if (action === "signup") {
          if (!name) {
            throw new Error("Name is required for signup");
          }

          if (verificationToken && verificationCode) {
            const verification = verifyToken(verificationToken, email, verificationCode);
            if (!verification.valid) {
              throw new Error(verification.error || "Email verification failed");
            }
          }

          // Try Notion first, fallback to in-memory
          let newUser;

          if (NOTION_TOKEN && NOTION_USERS_DB_ID) {
            try {
              // Check if user exists in Notion
              const existingUser = await findUserByEmail(email);
              if (existingUser) {
                throw new Error("User with this email already exists");
              }

              // Create user in Notion
              const notionUser = await createUserInNotion({ name, email, password, phone });
              console.log('✅ New user registered in Notion:', email);

              newUser = {
                id: notionUser.id,
                name: name,
                email: email,
              };
            } catch (error) {
              console.error('❌ Notion error details:', {
                message: error.message,
                status: error.status || 'unknown',
                code: error.code || 'unknown',
                stack: error.stack
              });
              // Don't fallback - show the error to user
              throw new Error(error.message || "Failed to create account. Please check server logs for details.");
            }
          } else {
            // Fallback to in-memory storage
            const existingUser = users.find(u => u.email === email);
            if (existingUser) {
              throw new Error("User with this email already exists");
            }

            newUser = {
              id: Date.now().toString(),
              name: name,
              email: email,
              password: hashPassword(password),
              createdAt: new Date().toISOString(),
            };

            users.push(newUser);
            console.log('✅ New user registered (in-memory):', email);
          }

          return {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
          };
        }

        // For login
        if (action === "login") {
          let user = null;

          if (NOTION_TOKEN && NOTION_USERS_DB_ID) {
            try {
              // Try Notion first
              const notionUser = await findUserByEmail(email);

              if (!notionUser) {
                throw new Error("Invalid email or password");
              }

              // Resolve property keys dynamically
              const props = notionUser.properties || {};
              const propKeys = Object.keys(props);
              const titleKey = propKeys.find(k => props[k]?.type === 'title');
              const emailKey = propKeys.find(k => props[k]?.type === 'email');
              const passwordKey = propKeys.find(k => {
                const t = props[k]?.type;
                return t === 'rich_text' || t === 'text';
              });

              // Extract stored password safely
              const storedPassword = passwordKey
                ? ((props[passwordKey].rich_text?.[0]?.text?.content) ?? (props[passwordKey].text?.[0]?.text?.content))
                : undefined;

              if (!storedPassword) {
                throw new Error("Invalid email or password");
              }

              // Verify password
              if (hashPassword(password) !== storedPassword) {
                throw new Error("Invalid email or password");
              }

              console.log('✅ User logged in (Notion):', email);

              user = {
                id: notionUser.id,
                name: titleKey ? (props[titleKey]?.title?.[0]?.text?.content || name) : name,
                email: emailKey ? (props[emailKey]?.email || email) : email,
              };
            } catch (error) {
              console.error('Notion login error:', error.message);
              throw error;
            }
          } else {
            // Fallback to in-memory storage
            const inMemoryUser = users.find(u => u.email === email);

            if (!inMemoryUser) {
              throw new Error("Invalid email or password");
            }

            const hashedPassword = hashPassword(password);
            if (inMemoryUser.password !== hashedPassword) {
              throw new Error("Invalid email or password");
            }

            console.log('✅ User logged in (in-memory):', email);

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
    Google({
      clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allow relative paths
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow redirects to mostafayasser.com subdomains and dev hosts
      try {
        const parsed = new URL(url);
        if (
          parsed.hostname.endsWith("mostafayasser.com") ||
          parsed.hostname === "localhost" ||
          parsed.hostname.endsWith(".vercel.app")
        ) {
          return url;
        }
      } catch {
        // fallback to baseUrl on malformed URL
      }
      return baseUrl;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user?.email;
        const name = user?.name || "Google User";

        if (NOTION_TOKEN && NOTION_USERS_DB_ID && email) {
          try {
            const existingUser = await findUserByEmail(email);
            if (!existingUser) {
              await createUserInNotion({
                name,
                email,
                password: crypto.randomBytes(16).toString("hex"),
                phone: "",
              });
              console.log("✅ New Google user registered in Notion:", email);
            }
          } catch (err) {
            console.error("❌ Error syncing Google user to Notion:", err);
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
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || "fallback-secret-for-development",
};
