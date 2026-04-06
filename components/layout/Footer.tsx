'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Link2, Globe, AtSign, Share2 } from 'lucide-react'
import { useCompanyInfo } from '@/lib/context/CompanyInfoContext'
import { services } from '@/lib/data/services'

export function Footer() {
  const company = useCompanyInfo()

  return (
    <footer className="bg-[#0A0F1E] text-[#F8FAFC]">
      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
          {/* Col 1: Brand */}
          <div className="lg:col-span-1">
            {company.logo_dark_url ? (
              <Image
                src={company.logo_dark_url}
                alt={company.agency_name ?? 'Ascelo AI'}
                width={140}
                height={40}
                className="mb-3 object-contain"
              />
            ) : (
              <p className="font-heading font-bold text-white text-2xl mb-3">
                {company.agency_name}
              </p>
            )}
            <p className="text-[#F8FAFC]/60 text-sm leading-relaxed mb-6">
              {company.tagline ?? 'AI-Powered. Human-Managed. Results Guaranteed.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {company.linkedin_url && (
                <a
                  href={company.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-[#F8FAFC]/50 hover:text-[#EC4899] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
                >
                  <Link2 className="w-5 h-5" />
                </a>
              )}
              {company.twitter_url && (
                <a
                  href={company.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter / X"
                  className="text-[#F8FAFC]/50 hover:text-[#EC4899] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
                >
                  <AtSign className="w-5 h-5" />
                </a>
              )}
              {company.instagram_url && (
                <a
                  href={company.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#F8FAFC]/50 hover:text-[#EC4899] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
                >
                  <Share2 className="w-5 h-5" />
                </a>
              )}
              {company.facebook_url && (
                <a
                  href={company.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-[#F8FAFC]/50 hover:text-[#EC4899] transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {/* Fallback social row if none are set */}
              {!company.linkedin_url && !company.twitter_url && !company.instagram_url && !company.facebook_url && (
                <div className="flex items-center gap-4">
                  <span className="text-[#F8FAFC]/50 hover:text-[#EC4899] transition-colors duration-300 cursor-pointer">
                    <Link2 className="w-5 h-5" />
                  </span>
                  <span className="text-[#F8FAFC]/50 hover:text-[#EC4899] transition-colors duration-300 cursor-pointer">
                    <AtSign className="w-5 h-5" />
                  </span>
                  <span className="text-[#F8FAFC]/50 hover:text-[#EC4899] transition-colors duration-300 cursor-pointer">
                    <Globe className="w-5 h-5" />
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-6">
              Services
            </h3>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[#F8FAFC]/60 hover:text-[#EC4899] text-sm transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Company */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-6">
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                { label: 'Case Studies', href: '/case-studies' },
                { label: 'Political Campaigns', href: '/services/political-campaign-marketing' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#F8FAFC]/60 hover:text-[#EC4899] text-sm transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="font-heading font-semibold text-white text-sm uppercase tracking-widest mb-6">
              Contact
            </h3>
            <ul className="space-y-3">
              {company.email && (
                <li>
                  <a
                    href={`mailto:${company.email}`}
                    className="text-[#F8FAFC]/60 hover:text-[#EC4899] text-sm transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
                  >
                    {company.email}
                  </a>
                </li>
              )}
              {!company.email && (
                <li>
                  <a
                    href="mailto:info@ascelo.ai"
                    className="text-[#F8FAFC]/60 hover:text-[#EC4899] text-sm transition-colors duration-300 cursor-pointer"
                  >
                    info@ascelo.ai
                  </a>
                </li>
              )}
              {company.phone && (
                <li>
                  <a
                    href={`tel:${company.phone}`}
                    className="text-[#F8FAFC]/60 hover:text-[#EC4899] text-sm transition-colors duration-300 cursor-pointer"
                  >
                    {company.phone}
                  </a>
                </li>
              )}
              {!company.phone && (
                <li>
                  <a
                    href="tel:+15873292590"
                    className="text-[#F8FAFC]/60 hover:text-[#EC4899] text-sm transition-colors duration-300 cursor-pointer"
                  >
                    +1 (587) 329-2590
                  </a>
                </li>
              )}
              <li className="text-[#F8FAFC]/60 text-sm">
                Calgary, Canada · Serving clients globally
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#F8FAFC]/40 text-sm">
            © {new Date().getFullYear()} {company.agency_name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-[#F8FAFC]/40 hover:text-[#F8FAFC]/70 text-sm transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#F8FAFC]/40 hover:text-[#F8FAFC]/70 text-sm transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
