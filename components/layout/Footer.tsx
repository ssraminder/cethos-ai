'use client'

import Link from 'next/link'
import { Link2, Share2, AtSign } from 'lucide-react'
import { useCompanyInfo } from '@/lib/context/CompanyInfoContext'

const serviceLinks = [
  { label: 'Multilingual & Multicultural Marketing', href: '/services/multilingual-marketing' },
  { label: 'WhatsApp & SMS Campaigns', href: '/services/whatsapp-sms-campaigns' },
  { label: 'Performance Marketing (PPC)', href: '/services/performance-marketing' },
  { label: 'AI Voice Agents', href: '/services/ai-voice-calling' },
  { label: 'SEO & Online Reputation', href: '/services/seo-reputation' },
  { label: 'Lead Generation', href: '/services/lead-generation-outreach' },
]

const companyLinks = [
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'About Us', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Footer() {
  const company = useCompanyInfo()

  return (
    <footer className="bg-[#0e1322] border-t border-outline-variant/15 w-full">
      {/* Main grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 px-8 lg:px-12 py-16 max-w-7xl mx-auto font-body text-sm">
        {/* Col 1: Brand */}
        <div>
          <div className="text-xl font-bold text-primary mb-4 font-headline tracking-tighter">Ascelo.ai</div>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            Automating enterprise-grade marketing for SMEs across Canada, India, and the UAE.
          </p>
          <div className="flex gap-4">
            <a
              href={company.linkedin_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              <Link2 className="w-5 h-5" />
            </a>
            <a
              href={company.instagram_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              <Share2 className="w-5 h-5" />
            </a>
            <a
              href={company.twitter_url ?? '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
            >
              <AtSign className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Col 2: Services */}
        <div>
          <h4 className="text-white font-headline font-bold mb-6">Services</h4>
          <ul className="space-y-4">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Company */}
        <div>
          <h4 className="text-white font-headline font-bold mb-6">Company</h4>
          <ul className="space-y-4">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Contact */}
        <div>
          <h4 className="text-white font-headline font-bold mb-6">Contact</h4>
          <ul className="space-y-4">
            <li>
              <a
                href={`mailto:${company.email ?? 'info@ascelo.ai'}`}
                className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                {company.email ?? 'info@ascelo.ai'}
              </a>
            </li>
            <li>
              <a
                href={`tel:${company.phone ?? '+15873292590'}`}
                className="text-on-surface-variant hover:text-primary transition-colors duration-300 cursor-pointer"
              >
                {company.phone ?? '+1 (587) 329-2590'}
              </a>
            </li>
            <li className="text-on-surface-variant">
              Calgary, Canada · Serving clients globally
            </li>
          </ul>
        </div>
      </div>

      {/* Language row */}
      <div className="border-t border-outline-variant/10 px-8 lg:px-12">
        <div className="max-w-7xl mx-auto py-4 flex flex-wrap gap-4 text-sm">
          {['EN', 'HI', 'AR', 'FR', 'PA'].map((lang, i) => (
            <span key={lang}>
              <span className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer">
                {lang}
              </span>
              {i < 4 && <span className="text-outline-variant ml-4">|</span>}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-outline-variant/10 py-8 px-8 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-on-surface-variant text-sm">
        <div>&copy; 2026 Ascelo AI. All rights reserved.</div>
        <div className="flex gap-8">
          <Link href="/privacy" className="hover:text-primary transition-colors duration-300 cursor-pointer">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-primary transition-colors duration-300 cursor-pointer">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
