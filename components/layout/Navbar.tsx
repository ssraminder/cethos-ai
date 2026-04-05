'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, ChevronDown, Globe } from 'lucide-react'
import { useCompanyInfo } from '@/lib/context/CompanyInfoContext'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { LanguageConfirmBanner } from '@/components/layout/LanguageConfirmBanner'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'ar', label: 'العربية', short: 'AR' },
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'hi', label: 'हिंदी', short: 'HI' },
  { code: 'pa', label: 'ਪੰਜਾਬੀ', short: 'PA' },
]

const NON_DEFAULT_LOCALES = ['ar', 'fr', 'hi', 'pa']

interface NavbarProps {
  locale?: string
}

export function Navbar({ locale = 'en' }: NavbarProps) {
  const company = useCompanyInfo()
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [pendingLocale, setPendingLocale] = useState<string | null>(null)
  const langRef = useRef<HTMLDivElement>(null)

  const prefix = locale === 'en' ? '' : `/${locale}`

  const navLinks = [
    { label: 'Home', href: `${prefix}/` },
    { label: 'Services', href: `${prefix}/services` },
    { label: 'Case Studies', href: `${prefix}/case-studies` },
    { label: 'About', href: `${prefix}/about` },
    { label: 'Blog', href: `${prefix}/blog` },
    { label: 'Contact', href: `${prefix}/contact` },
  ]

  // Strip current locale prefix from pathname to get the bare path
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

  // Switch locale: for English, clear saved preference cookie.
  // For other locales, set a session-only cookie and show a "save preference?" banner.
  const switchLocale = (newLocale: string) => {
    setLangOpen(false)
    if (newLocale === 'en') {
      // Clear any saved locale preference → system detection takes over
      document.cookie = 'NEXT_LOCALE=; path=/; max-age=0; SameSite=Lax'
      setPendingLocale(null)
      router.push(switchLocalePath(newLocale))
    } else {
      // Session-only cookie (no max-age) — clears when browser closes
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; SameSite=Lax`
      setPendingLocale(newLocale)
      router.push(switchLocalePath(newLocale))
    }
  }

  const saveLocalePreference = () => {
    if (!pendingLocale) return
    // Upgrade to persistent 1-year cookie
    document.cookie = `NEXT_LOCALE=${pendingLocale}; path=/; max-age=31536000; SameSite=Lax`
    setPendingLocale(null)
  }

  const dismissLocaleBanner = () => {
    setPendingLocale(null)
  }

  // Close dropdown on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  const currentLang = LANGUAGES.find(l => l.code === locale) ?? LANGUAGES[0]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1E] backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link
              href={`${prefix}/`}
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
            >
              {company.logo_url ? (
                <Image
                  src={company.logo_url}
                  alt={company.agency_name}
                  width={140}
                  height={40}
                  className="h-10 w-auto object-contain"
                />
              ) : (
                <span className="font-heading font-bold text-white text-xl">
                  {company.agency_name}
                </span>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-heading font-medium transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]',
                    pathname === link.href || (link.href.endsWith('/') && pathname === link.href.slice(0, -1))
                      ? 'text-[#EC4899]'
                      : 'text-white/80 hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Language Dropdown + CTA + Hamburger */}
            <div className="flex items-center gap-3">

              {/* Language dropdown — desktop */}
              <div ref={langRef} className="relative hidden md:block">
                <button
                  onClick={() => setLangOpen(prev => !prev)}
                  aria-label="Select language"
                  aria-expanded={langOpen}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-heading font-medium text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
                >
                  <Globe className="w-4 h-4 text-[#06B6D4]" />
                  <span className="text-white font-semibold">{currentLang.short}</span>
                  <ChevronDown
                    className={cn(
                      'w-3.5 h-3.5 transition-transform duration-200',
                      langOpen ? 'rotate-180' : 'rotate-0'
                    )}
                  />
                </button>

                {/* Dropdown panel */}
                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-[#111827] border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-2.5 text-sm font-heading transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#06B6D4]',
                          locale === lang.code
                            ? 'bg-[#EC4899]/10 text-[#EC4899] font-semibold'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <span>{lang.label}</span>
                        <span className="text-xs text-white/30">{lang.short}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Link
                href={`${prefix}/contact`}
                className="hidden md:inline-flex bg-[#06B6D4] text-white px-5 py-2 rounded-lg font-heading font-semibold text-sm hover:bg-[#06B6D4]/90 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] items-center"
              >
                {company.hero_cta_primary ?? 'Get a Free Audit'}
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        company={company}
        locale={locale}
      />

      {pendingLocale && pendingLocale !== 'en' && (
        <LanguageConfirmBanner
          locale={pendingLocale}
          onSave={saveLocalePreference}
          onDismiss={dismissLocaleBanner}
        />
      )}
    </>
  )
}
