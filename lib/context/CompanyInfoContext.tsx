'use client'

import { createContext, useContext } from 'react'
import type { CompanyInfo } from '@/lib/types'

const CompanyInfoContext = createContext<CompanyInfo | null>(null)

export function CompanyInfoProvider({
  children,
  value,
}: {
  children: React.ReactNode
  value: CompanyInfo
}) {
  return (
    <CompanyInfoContext.Provider value={value}>
      {children}
    </CompanyInfoContext.Provider>
  )
}

export function useCompanyInfo(): CompanyInfo {
  const ctx = useContext(CompanyInfoContext)
  if (!ctx) throw new Error('useCompanyInfo must be used within CompanyInfoProvider')
  return ctx
}
