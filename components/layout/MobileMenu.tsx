'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { X, Globe, Check } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import type { CompanyInfo } from '@/lib/types'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'hi', label: 'हिंदी', short: 'HI' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', short: 'PA' },
]

const NON_DEFAULT_LOCALES = ['ar', 'fr', 'hi', 'pa']

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  company: CompanyInfo
  locale?: string
}

export function MobileMenu({ isOpen, onClose, company, locale = 'en' }: MobileMenuProps) {
  const pathname = usePathname()
  const router = useRouter()
  const prefix = locale === 'en' ? '' : `/${locale}`

  const navLinks = [
    { label: 'Home', href: `${prefix}/` },
    { label: 'Services', href: `${prefix}/services` },
    { label: 'Case Studies', href: `${prefix}/case-studies` },
    { label: 'About', href: `${prefix}/about` },
    { label: 'Blog', href: `${prefix}/blog` },
    { label: 'Contact', href: `${prefix}/contact` },
  ]

  const switchLocalePath = (newLocale: string) => {
    let pathWithoutLocale = pathname
    for (const loc of NON_DEFAULT_LOCALES) {
      if (pathname.startsWith(`/${loc}`)) {
        pathWithoutLocale = pathname.slice(`/${loc}`.length) || '/'
        break
      }
    }
    if (newLocale === 'en') return pathWithoutLocale || '/'
    return `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`
  }

  const switchLocale = (newLocale: string) => {
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`
    onClose()
    router.push(switchLocalePath(newLocale))
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#0A0F1E] flex flex-col overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <span className="font-heading font-bold text-white text-xl">
              {company.agency_name}
            </span>
            <button
              onClick={onClose}
              aria-label="Close menu"
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col px-6 pt-6 gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={onClose}
                  className={cn(
                    'block text-2xl font-heading font-semibold py-3 px-4 rounded-lg transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]',
                    pathname === link.href
                      ? 'text-[#EC4899] bg-white/5'
                      : 'text-white hover:text-[#EC4899] hover:bg-white/5'
                  )}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Language selector */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: navLinks.length * 0.05 + 0.05 }}
            className="px-6 pt-6 pb-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-[#06B6D4]" />
              <span className="text-xs font-heading font-semibold text-white/40 uppercase tracking-widest">
                Language
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1 bg-[#111827] rounded-xl border border-white/10 overflow-hidden">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => switchLocale(lang.code)}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 text-sm font-heading transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#06B6D4]',
                    locale === lang.code
                      ? 'bg-[#EC4899]/10 text-[#EC4899] font-semibold'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  )}
                >
                  <span>{lang.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/30">{lang.short}</span>
                    {locale === lang.code && (
                      <Check className="w-3.5 h-3.5 text-[#EC4899]" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <div className="px-6 pb-8 mt-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Link
                href={`${prefix}/contact`}
                onClick={onClose}
                className="block w-full text-center bg-[#06B6D4] text-white px-6 py-4 rounded-lg font-heading font-semibold text-lg hover:bg-[#06B6D4]/90 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
              >
                {company.hero_cta_primary ?? 'Get a Free Audit'}
              </Link>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
