'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { useCompanyInfo } from '@/lib/context/CompanyInfoContext'
import { MobileMenu } from '@/components/layout/MobileMenu'
import { cn } from '@/lib/utils'

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'ar', label: 'ع' },
  { code: 'fr', label: 'FR' },
  { code: 'hi', label: 'हि' },
  { code: 'pa', label: 'ਪੰ' },
]

interface NavbarProps {
  locale?: string
}

export function Navbar({ locale = 'en' }: NavbarProps) {
  const company = useCompanyInfo()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Build nav links prefixed with locale (for non-en locales)
  const prefix = locale === 'en' ? '' : `/${locale}`

  const navLinks = [
    { labelKey: 'home', label: 'Home', href: `${prefix}/` },
    { labelKey: 'services', label: 'Services', href: `${prefix}/services` },
    { labelKey: 'caseStudies', label: 'Case Studies', href: `${prefix}/case-studies` },
    { labelKey: 'about', label: 'About', href: `${prefix}/about` },
    { labelKey: 'blog', label: 'Blog', href: `${prefix}/blog` },
    { labelKey: 'contact', label: 'Contact', href: `${prefix}/contact` },
  ]

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

            {/* Language Switcher + CTA + Hamburger */}
            <div className="flex items-center gap-3">
              {/* Language switcher — desktop */}
              <div className="hidden md:flex items-center gap-0 text-sm font-heading">
                {LANGUAGES.map((lang, i) => (
                  <span key={lang.code} className="flex items-center">
                    {i > 0 && <span className="text-[#F8FAFC]/20 mx-1 select-none">|</span>}
                    <Link
                      href={lang.code === 'en' ? '/' : `/${lang.code}`}
                      className={cn(
                        'px-1 py-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded',
                        locale === lang.code
                          ? 'text-[#EC4899] font-bold'
                          : 'text-[#F8FAFC]/50 hover:text-[#F8FAFC]'
                      )}
                    >
                      {lang.label}
                    </Link>
                  </span>
                ))}
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
    </>
  )
}
