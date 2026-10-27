import { NextResponse } from 'next/server';
import { rateLimit, getClientIp } from '@/src/lib/rate-limit';
import { isValidEmail, normalizeEmail } from '@/src/lib/validation';

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DB_ID = process.env.NOTION_USERS_DB_ID || process.env.NOTION_DB_ID;

const ALLOWED_LANGUAGES = ['en', 'ar'];
const MAX_NAME_LENGTH = 100;

function notionHeaders() {
  return {
    'Authorization': `Bearer ${NOTION_TOKEN}`,
    'Content-Type': 'application/json',
    'Notion-Version': '2022-06-28',
  };
}

// Build a Notion value for a property depending on how the database defines it
function textValue(propType, content) {
  if (propType === 'select') return { select: { name: content } };
  if (propType === 'title') return { title: [{ text: { content } }] };
  return { rich_text: [{ text: { content } }] };
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name } = body;

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const email = normalizeEmail(body.email);
    const language = ALLOWED_LANGUAGES.includes(body.language) ? body.language : undefined;
    const cleanName = typeof name === 'string' ? name.trim().slice(0, MAX_NAME_LENGTH) : '';

    const limit = rateLimit(`subscribe:${getClientIp(request.headers)}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    // Get the database schema to understand the structure
    const dbResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}`, {
      method: 'GET',
      headers: notionHeaders(),
    });

    if (!dbResponse.ok) {
      console.error('Database access error:', dbResponse.status);
      return NextResponse.json(
        { error: 'Failed to save subscription. Please try again later.' },
        { status: 500 }
      );
    }

    const dbData = await dbResponse.json();
    const availableProps = Object.keys(dbData.properties);

    // Check if email already exists in the database
    const emailProp = availableProps.find(prop =>
      dbData.properties[prop].type === 'email' ||
      prop.toLowerCase().includes('email')
    );

    if (emailProp) {
      const checkDuplicateResponse = await fetch(`https://api.notion.com/v1/databases/${NOTION_DB_ID}/query`, {
        method: 'POST',
        headers: notionHeaders(),
        body: JSON.stringify({
          filter: {
            property: emailProp,
            email: {
              equals: email
            }
          }
        }),
      });

      if (checkDuplicateResponse.ok) {
        const duplicateData = await checkDuplicateResponse.json();
        if (duplicateData.results && duplicateData.results.length > 0) {
          return NextResponse.json(
            {
              error: 'Email already subscribed',
              message: 'This email address is already subscribed to our newsletter.',
              alreadySubscribed: true
            },
            { status: 409 }
          );
        }
      }
    }

    // Build properties object dynamically based on what's available
    const properties = {};

    if (emailProp) {
      properties[emailProp] = { email };
    }

    const dateProp = availableProps.find(prop =>
      dbData.properties[prop].type === 'date' ||
      prop.toLowerCase().includes('date')
    );

    if (dateProp) {
      properties[dateProp] = {
        date: {
          start: new Date().toISOString().split('T')[0],
        },
      };
    }

    const statusProp = availableProps.find(prop =>
      dbData.properties[prop].type === 'select' &&
      prop.toLowerCase().includes('status')
    );

    if (statusProp) {
      properties[statusProp] = {
        select: {
          name: 'Active',
        },
      };
    }

    const languageProp = availableProps.find(prop =>
      prop.toLowerCase() === 'language'
    );

    if (languageProp && language) {
      properties[languageProp] = textValue(dbData.properties[languageProp].type, language);
    }

    const sourceProp = availableProps.find(prop =>
      prop.toLowerCase().includes('source')
    );

    if (sourceProp) {
      properties[sourceProp] = textValue(dbData.properties[sourceProp].type, 'Website');
    }

    // Separate Name property (rich_text)
    const nameProp = availableProps.find(prop =>
      prop.toLowerCase() === 'name' && dbData.properties[prop].type !== 'title'
    );

    if (nameProp && cleanName) {
      properties[nameProp] = {
        rich_text: [{ text: { content: cleanName } }],
      };
    }

    const titleProp = availableProps.find(prop =>
      dbData.properties[prop].type === 'title'
    );

    if (titleProp) {
      properties[titleProp] = {
        title: [{ text: { content: cleanName || `Subscriber: ${email}` } }],
      };
    }

    // Ensure we have at least one property for Notion
    if (Object.keys(properties).length === 0) {
      console.error('Subscribe: no suitable properties found in database');
      return NextResponse.json(
        { error: 'Failed to save subscription. Please try again later.' },
        { status: 500 }
      );
    }

    const response = await fetch(`https://api.notion.com/v1/pages`, {
      method: 'POST',
      headers: notionHeaders(),
      body: JSON.stringify({
        parent: {
          database_id: NOTION_DB_ID,
        },
        properties: properties,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Notion API error:', response.status, errorData.code);
      return NextResponse.json(
        { error: 'Failed to save subscription. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Subscription successful',
        subscriptionDate: new Date().toISOString()
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('❌ Subscription processing error:', error.message);
    return NextResponse.json(
      { error: 'Failed to process subscription. Please try again later.' },
      { status: 500 }
    );
  }
}
