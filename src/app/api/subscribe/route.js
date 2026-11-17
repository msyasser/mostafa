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

// Lists a visitor can join from the site, and the tag each one adds in the "Tags" multi-select
// (only used when the database has a multi-select property called Tags).
const LIST_TAGS = { 'course-waitlist': 'Course waitlist' };

function tagsPropOf(dbData) {
  const name = Object.keys(dbData.properties).find(
    (prop) => prop.toLowerCase() === 'tags' && dbData.properties[prop].type === 'multi_select'
  );
  return name || null;
}

// Adds a tag to an existing row, keeping the tags it already has.
// Returns true when the row did not have the tag yet (the visitor joined this list just now).
async function addTag(dbData, page, tag) {
  const prop = tagsPropOf(dbData);
  if (!prop) return true;
  const current = (page.properties?.[prop]?.multi_select || []).map((option) => ({ name: option.name }));
  if (current.some((option) => option.name === tag)) return false;
  const response = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
    method: 'PATCH',
    headers: notionHeaders(),
    body: JSON.stringify({ properties: { [prop]: { multi_select: [...current, { name: tag }] } } }),
  });
  if (!response.ok) console.error('Subscribe: could not add tag', response.status);
  return true;
}

// Course waitlist in Brevo: add the contact to the waitlist list and send the welcome email
// (Arabic or English template). Off until BREVO_API_KEY and both template ids are set in Vercel;
// BREVO_WAITLIST_LIST_ID is optional (without it the contact is saved with no list).
// Failures are logged and never break the signup.
const BREVO = {
  key: process.env.BREVO_API_KEY,
  listId: Number(process.env.BREVO_WAITLIST_LIST_ID),
  templates: {
    ar: Number(process.env.BREVO_WAITLIST_TEMPLATE_AR),
    en: Number(process.env.BREVO_WAITLIST_TEMPLATE_EN),
  },
};

// Returns true when the welcome email was accepted by Brevo.
async function joinBrevoWaitlist(email, language) {
  if (!BREVO.key || !BREVO.templates.ar || !BREVO.templates.en) return false;
  const headers = { 'api-key': BREVO.key, 'content-type': 'application/json', accept: 'application/json' };
  try {
    const contact = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({ email, ...(BREVO.listId ? { listIds: [BREVO.listId] } : {}), updateEnabled: true }),
    });
    if (!contact.ok && contact.status !== 204) console.error('Subscribe: Brevo contact failed', contact.status);

    const templateId = language === 'en' ? BREVO.templates.en : BREVO.templates.ar;
    const sent = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers,
      body: JSON.stringify({ templateId, to: [{ email }], tags: ['course-waitlist-welcome'] }),
    });
    if (!sent.ok) console.error('Subscribe: Brevo welcome email failed', sent.status);
    return sent.ok;
  } catch (error) {
    console.error('Subscribe: Brevo error', error.message);
    return false;
  }
}

// Course waiting list: its own Notion database ("Waiting List" under MY Hub) once
// NOTION_WAITLIST_DB_ID is set in Vercel and the database is shared with the site's integration.
// Columns: Name (title), Email, Language (ar/en), Joined, Status, Source, Welcome email, Notes.
// Without the variable, waitlist joins fall back to the newsletter database with a tag (below).
const NOTION_WAITLIST_DB_ID = process.env.NOTION_WAITLIST_DB_ID;

async function joinNotionWaitlist(email, language) {
  const existing = await fetch(`https://api.notion.com/v1/databases/${NOTION_WAITLIST_DB_ID}/query`, {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({ filter: { property: 'Email', email: { equals: email } }, page_size: 1 }),
  });
  if (!existing.ok) {
    console.error('Waitlist: Notion query failed', existing.status);
    return { ok: false };
  }
  if ((await existing.json()).results?.length) return { ok: true, alreadyJoined: true };

  const created = await fetch('https://api.notion.com/v1/pages', {
    method: 'POST',
    headers: notionHeaders(),
    body: JSON.stringify({
      parent: { database_id: NOTION_WAITLIST_DB_ID },
      properties: {
        Name: { title: [{ text: { content: email } }] },
        Email: { email },
        ...(language ? { Language: { select: { name: language } } } : {}),
        Joined: { date: { start: new Date().toISOString() } },
        Status: { select: { name: 'Waiting' } },
        Source: { select: { name: 'Website' } },
      },
    }),
  });
  if (!created.ok) {
    const errorData = await created.json().catch(() => ({}));
    console.error('Waitlist: Notion create failed', created.status, errorData.code);
    return { ok: false };
  }

  const page = await created.json();
  if (await joinBrevoWaitlist(email, language)) {
    const ticked = await fetch(`https://api.notion.com/v1/pages/${page.id}`, {
      method: 'PATCH',
      headers: notionHeaders(),
      body: JSON.stringify({ properties: { 'Welcome email': { checkbox: true } } }),
    });
    if (!ticked.ok) console.error('Waitlist: could not tick Welcome email', ticked.status);
  }
  return { ok: true, alreadyJoined: false };
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
    const tag = LIST_TAGS[body.list];

    const limit = rateLimit(`subscribe:${getClientIp(request.headers)}`, { limit: 5, windowMs: 10 * 60 * 1000 });
    if (!limit.ok) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    if (body.list === 'course-waitlist' && NOTION_WAITLIST_DB_ID) {
      const result = await joinNotionWaitlist(email, language);
      if (!result.ok) {
        return NextResponse.json(
          { error: 'Failed to save subscription. Please try again later.' },
          { status: 500 }
        );
      }
      return NextResponse.json({ success: true, alreadySubscribed: result.alreadyJoined });
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
          // Joining a list (e.g. the course waitlist) with an email we already have is not an error:
          // add the list's tag to the existing row and report success.
          if (tag) {
            const joinedNow = await addTag(dbData, duplicateData.results[0], tag);
            if (joinedNow && body.list === 'course-waitlist') await joinBrevoWaitlist(email, language);
            return NextResponse.json({ success: true, alreadySubscribed: true });
          }
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

    const tagsProp = tagsPropOf(dbData);
    if (tagsProp && tag) {
      properties[tagsProp] = { multi_select: [{ name: tag }] };
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

    if (body.list === 'course-waitlist') await joinBrevoWaitlist(email, language);

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
