'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { X } from 'lucide-react'
import { usePathname } from 'next/navigation'
import type { CompanyInfo } from '@/lib/types'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Case Studies', href: '/case-studies' },
  { label: 'Political Campaigns', href: '/political-campaigns' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  company: CompanyInfo
}

export function MobileMenu({ isOpen, onClose, company }: MobileMenuProps) {
  const pathname = usePathname()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#0A0F1E] flex flex-col"
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
          <nav className="flex flex-col flex-1 px-6 py-8 gap-2">
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

          {/* CTA */}
          <div className="px-6 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
            >
              <Link
                href="/contact"
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
