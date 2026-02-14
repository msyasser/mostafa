'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { submitContactForm } from '../actions'
import AnimatedWrapper from '@/src/app/[locale]/_components/AnimatedWrapper'

export default function ContactForm() {
    const t = useTranslations('ContactPage.form')
    const [status, setStatus] = useState('idle') // idle, submitting, success, error

    async function handleSubmit(event) {
        event.preventDefault()
        setStatus('submitting')
        const formData = new FormData(event.target)

        const result = await submitContactForm(formData)

        if (result.success) {
            setStatus('success')
            event.target.reset()
            setTimeout(() => setStatus('idle'), 5000)
        } else {
            console.error(result.message)
            setStatus('error')
        }
    }

    return (
        <section className="py-20 bg-neutral-900 border-t border-neutral-800">
            <div className="container mx-auto px-6 max-w-2xl">
                <AnimatedWrapper>
                    <div className="bg-neutral-950 border border-neutral-800 p-8 md:p-12 rounded-2xl shadow-2xl relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-main/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <h2 className="text-3xl font-bold text-white mb-8 text-center">{t('title')}</h2>

                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-neutral-400 mb-2">{t('name')}</label>
                                <input required type="text" name="name" id="name" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-main/50 focus:ring-1 focus:ring-main/50 transition-all backdrop-blur-sm" />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-neutral-400 mb-2">{t('email')}</label>
                                <input required type="email" name="email" id="email" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-main/50 focus:ring-1 focus:ring-main/50 transition-all backdrop-blur-sm" />
                            </div>

                            <div>
                                <label htmlFor="whatsapp" className="block text-sm font-medium text-neutral-400 mb-2">{t('whatsapp')}</label>
                                <input required type="text" name="whatsapp" id="whatsapp" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-main/50 focus:ring-1 focus:ring-main/50 transition-all backdrop-blur-sm" />
                            </div>

                            <div>
                                <label htmlFor="details" className="block text-sm font-medium text-neutral-400 mb-2">{t('details')}</label>
                                <textarea required name="details" id="details" rows="5" className="w-full bg-neutral-900/50 border border-neutral-800 rounded-lg px-5 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-main/50 focus:ring-1 focus:ring-main/50 transition-all backdrop-blur-sm resize-none"></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={status === 'submitting'}
                                className="w-full bg-main text-neutral-950 font-bold py-4 rounded-lg hover:bg-main/90 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-main/10 cursor-pointer"
                            >
                                {status === 'submitting' ? t('submitting') : t('submit')}
                            </button>

                            {status === 'success' && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center font-medium animate-in fade-in slide-in-from-bottom-2">
                                    {t('success')}
                                </div>
                            )}
                            {status === 'error' && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-center font-medium animate-in fade-in slide-in-from-bottom-2">
                                    {t('error')}
                                </div>
                            )}
                        </form>
                    </div>
                </AnimatedWrapper>
            </div>
        </section>
    )
}
