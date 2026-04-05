import Link from 'next/link'

interface CtaBannerSimpleProps {
  locale?: string
  heading?: string
  subtext?: string
  buttonLabel?: string
}

export function CtaBannerSimple({
  locale = 'en',
  heading = 'Ready to Grow Your Business?',
  subtext = 'Get a free strategy audit from the Cethos Media team. No commitment, just clarity.',
  buttonLabel = 'Get a Free Audit',
}: CtaBannerSimpleProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <section className="bg-gradient-to-r from-[#0A0F1E] to-[#1a1f35] py-20 md:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-display text-4xl md:text-6xl text-white leading-none tracking-wide uppercase mb-4">
          {heading}
        </h2>
        <p className="font-body text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          {subtext}
        </p>
        <Link
          href={`${prefix}/contact`}
          className="inline-flex bg-[#06B6D4] text-white px-10 py-4 rounded-xl font-heading font-semibold text-lg hover:bg-[#06B6D4]/90 transition-all duration-300 cursor-pointer shadow-lg shadow-[#06B6D4]/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  )
}
