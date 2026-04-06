'use client'

import { clients as fallbackClients } from '@/lib/data/clients'
import { LogoStrip } from '@/components/shared/LogoStrip'
import type { Client } from '@/lib/types'

interface ClientLogosProps {
  clients?: (Client | Omit<Client, 'id'>)[]
}

export function ClientLogos({ clients }: ClientLogosProps) {
  const displayClients = clients && clients.length > 0 ? clients : fallbackClients
  return (
    <section className="bg-white py-12 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <LogoStrip clients={displayClients} />
      </div>
    </section>
  )
}
