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
    setLangOpen(false)
    if (newLocale === 'en') {
      document.cookie = 'NEXT_LOCALE=; path=/; max-age=0; SameSite=Lax'
      setPendingLocale(null)
      router.push(switchLocalePath(newLocale))
    } else {
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; SameSite=Lax`
      setPendingLocale(newLocale)
      router.push(switchLocalePath(newLocale))
    }
  }

  const saveLocalePreference = () => {
    if (!pendingLocale) return
    document.cookie = `NEXT_LOCALE=${pendingLocale}; path=/; max-age=31536000; SameSite=Lax`
    setPendingLocale(null)
  }

  const dismissLocaleBanner = () => {
    setPendingLocale(null)
  }

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

  const isActive = (href: string) =>
    pathname === href || (href.endsWith('/') && pathname === href.slice(0, -1))

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-[#0e1322]/80 backdrop-blur-xl shadow-[0_8px_30px_rgb(76,215,246,0.05)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* Logo */}
            <Link
              href={`${prefix}/`}
              className="flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
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
                <span className="text-2xl font-bold tracking-tighter text-primary font-headline">
                  Ascelo.ai
                </span>
              )}
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'font-headline font-semibold tracking-tight text-sm transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded',
                    isActive(link.href)
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-on-surface-variant hover:text-white'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side: language + CTA + hamburger */}
            <div className="flex items-center gap-4">
              {/* Language dropdown — desktop */}
              <div ref={langRef} className="relative hidden md:block">
                <button
                  onClick={() => setLangOpen(prev => !prev)}
                  aria-label="Select language"
                  aria-expanded={langOpen}
                  className="flex items-center gap-1.5 text-on-surface-variant hover:text-primary transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  <Globe className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium uppercase">{currentLang.short}</span>
                </button>

                {langOpen && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-surface-container border border-outline-variant/15 rounded-xl shadow-xl overflow-hidden z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => switchLocale(lang.code)}
                        className={cn(
                          'w-full flex items-center justify-between px-4 py-2.5 text-sm font-headline transition-colors duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary',
                          locale === lang.code
                            ? 'bg-primary/10 text-primary font-semibold'
                            : 'text-on-surface-variant hover:bg-white/5 hover:text-white'
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
                className="hidden md:inline-flex bg-gradient-to-r from-primary to-primary-container text-on-primary px-6 py-2.5 rounded-lg font-headline font-semibold text-sm hover:opacity-90 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary items-center scale-95 active:scale-90"
              >
                Get a Free Strategy Audit
              </Link>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
