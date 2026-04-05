'use client'

import { X } from 'lucide-react'

const LANGUAGE_LABELS: Record<string, string> = {
  ar: 'Arabic (العربية)',
  fr: 'French (Français)',
  hi: 'Hindi (हिंदी)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
}

interface LanguageConfirmBannerProps {
  locale: string
  onSave: () => void
  onDismiss: () => void
}

export function LanguageConfirmBanner({ locale, onSave, onDismiss }: LanguageConfirmBannerProps) {
  const langLabel = LANGUAGE_LABELS[locale] ?? locale

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0F1E] border-t border-[#EC4899]/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="font-body text-white/80 text-sm leading-relaxed">
          Save <span className="text-[#EC4899] font-semibold">{langLabel}</span> as your preferred language?
          You can change it anytime from the language menu.
        </p>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={onSave}
            className="bg-[#06B6D4] text-white px-5 py-2 rounded-lg font-heading font-semibold text-sm hover:bg-[#06B6D4]/90 transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
          >
            Save preference
          </button>
          <button
            onClick={onDismiss}
            className="text-white/50 hover:text-white px-3 py-2 rounded-lg font-heading text-sm transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
          >
            Not now
          </button>
          <button
            onClick={onDismiss}
            aria-label="Dismiss"
            className="text-white/30 hover:text-white transition-colors duration-200 cursor-pointer focus-visible:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
