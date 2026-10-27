'use server'

import { headers } from 'next/headers'
import { Client } from '@notionhq/client'
import { rateLimit, getClientIp } from '@/src/lib/rate-limit'
import { isValidEmail, normalizeEmail } from '@/src/lib/validation'

const MAX_NAME_LENGTH = 100
const MAX_WHATSAPP_LENGTH = 30
// Notion rejects a single rich_text object longer than 2000 characters
const MAX_DETAILS_LENGTH = 2000

function readField(formData, key, maxLength) {
    const value = formData.get(key)
    return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

export async function submitContactForm(formData) {
    const name = readField(formData, 'name', MAX_NAME_LENGTH)
    const email = normalizeEmail(readField(formData, 'email', 254))
    const whatsapp = readField(formData, 'whatsapp', MAX_WHATSAPP_LENGTH)
    const details = readField(formData, 'details', MAX_DETAILS_LENGTH)

    if (!name || !details || !isValidEmail(email)) {
        return { success: false, message: 'Invalid form data' }
    }

    const ip = getClientIp(await headers())
    const limit = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60 * 1000 })
    if (!limit.ok) {
        return { success: false, message: 'Too many requests' }
    }

    if (!process.env.NOTION_TOKEN || !process.env.NOTION_CONTACT_DB_ID) {
        return { success: false, message: 'Missing Notion configuration' }
    }

    const notion = new Client({ auth: process.env.NOTION_TOKEN })

    try {
        await notion.pages.create({
            parent: { database_id: process.env.NOTION_CONTACT_DB_ID },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name,
                            },
                        },
                    ],
                },
                Email: {
                    email: email,
                },
                WhatsApp: {
                    phone_number: whatsapp || null,
                },
                Details: {
                    rich_text: [
                        {
                            text: {
                                content: details,
                            },
                        },
                    ],
                },
            },
        })
        return { success: true }
    } catch (error) {
        console.error('Notion API Error:', error.message)
        return { success: false, message: 'Failed to submit form' }
    }
}
