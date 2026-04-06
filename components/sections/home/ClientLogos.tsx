'use client'

import { Building2, Scale, HeartPulse, Cpu, Landmark, Stethoscope, Plane, ShoppingBag, Megaphone, UtensilsCrossed, GraduationCap, Zap } from 'lucide-react'

const INDUSTRIES = [
  { label: 'Real Estate', icon: Building2 },
  { label: 'Legal & Law', icon: Scale },
  { label: 'Healthcare', icon: HeartPulse },
  { label: 'SaaS & Tech', icon: Cpu },
  { label: 'Finance & Insurance', icon: Landmark },
  { label: 'Dental & Medical', icon: Stethoscope },
  { label: 'Immigration', icon: Plane },
  { label: 'E-Commerce', icon: ShoppingBag },
  { label: 'Political Campaigns', icon: Megaphone },
  { label: 'Restaurants', icon: UtensilsCrossed },
  { label: 'Education', icon: GraduationCap },
  { label: 'Solar & Clean Energy', icon: Zap },
]

const doubled = [...INDUSTRIES, ...INDUSTRIES]

export function ClientLogos() {
  return (
    <section className="bg-white py-12 w-full overflow-hidden border-y border-[#EC4899]/8">
      <p className="text-center text-[#831843]/50 font-heading font-medium text-xs uppercase tracking-widest mb-8">
        Industries we grow
      </p>

      <div className="relative">
        {/* Fade edges */}
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to right, white, transparent)' }}
          aria-hidden="true"
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, white, transparent)' }}
          aria-hidden="true"
        />

        {/* Scrolling track */}
        <div
          className="flex items-center"
          style={{ animation: 'scroll 40s linear infinite', width: 'max-content' }}
        >
          {doubled.map((item, index) => {
            const Icon = item.icon
            return (
              <div
                key={index}
                className="flex-shrink-0 mx-3 flex items-center gap-2 px-4 py-2 rounded-full border border-[#EC4899]/15 bg-[#FDF2F8]/60 text-[#831843]/70 hover:border-[#EC4899]/40 hover:text-[#EC4899] transition-colors duration-300 cursor-default"
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="font-heading font-medium text-sm whitespace-nowrap">{item.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
