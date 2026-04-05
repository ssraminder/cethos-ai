'use client'

import Image from 'next/image'
import type { Client } from '@/lib/types'

interface LogoStripProps {
  clients: (Client | Omit<Client, 'id'>)[]
}

export function LogoStrip({ clients }: LogoStripProps) {
  const doubled = [...clients, ...clients]

  return (
    <div className="w-full overflow-hidden">
      <p className="text-center text-[#831843]/50 font-heading font-medium text-sm uppercase tracking-widest mb-8">
        Trusted by brands across India, UAE and Canada
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
          style={{
            animation: 'scroll 30s linear infinite',
            width: 'max-content',
          }}
        >
          {doubled.map((client, index) => (
            <div
              key={index}
              className="flex-shrink-0 mx-8 grayscale hover:grayscale-0 hover:scale-110 transition-all duration-300 cursor-pointer"
              title={client.name}
            >
              <div className="h-10 w-32 flex items-center justify-center">
                {client.logo_url.endsWith('.svg') || client.logo_url.startsWith('/') ? (
                  // For local SVGs or relative paths, use next/image or fallback text
                  <div className="flex items-center justify-center w-full h-full">
                    <span className="font-heading font-semibold text-[#831843]/60 text-sm text-center leading-tight">
                      {client.name}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={client.logo_url}
                    alt={client.name}
                    width={128}
                    height={40}
                    className="h-10 w-auto object-contain max-w-[128px]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
