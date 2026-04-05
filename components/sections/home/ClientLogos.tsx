'use client'

import { clients } from '@/lib/data/clients'
import { LogoStrip } from '@/components/shared/LogoStrip'

export function ClientLogos() {
  return (
    <section className="bg-white py-12 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LogoStrip clients={clients} />
      </div>
    </section>
  )
}
