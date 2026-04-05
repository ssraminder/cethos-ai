import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from './i18n'

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed', // / for English, /ar /fr /hi /pa for others
  localeDetection: true,     // Auto-detect from Accept-Language header
  // Map browser language codes to our supported locales
  // next-intl matches the best locale automatically —
  // e.g. browser "ar-AE" → 'ar', "fr-CA" → 'fr', "pa-IN" → 'pa',
  // "hi-IN" → 'hi', anything else → 'en' (defaultLocale)
})

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
}
