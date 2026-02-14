'use server'

import { Client } from '@notionhq/client'

export async function submitContactForm(formData) {
    const name = formData.get('name')
    const email = formData.get('email')
    const whatsapp = formData.get('whatsapp')
    const details = formData.get('details')

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
                    phone_number: whatsapp,
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
        console.error('Notion API Error:', error)
        return { success: false, message: `Failed to submit form: ${error.message}` }
    }
}
