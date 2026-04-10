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
  subtext = 'Get a free strategy audit from the Ascelo AI team. No commitment, just clarity.',
  buttonLabel = 'Get a Free Audit',
}: CtaBannerSimpleProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <section className="relative bg-background py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_#4cd7f6,_transparent_70%)]" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-headline font-extrabold text-4xl md:text-5xl text-white leading-tight tracking-tight mb-4">
          {heading}
        </h2>
        <p className="font-body text-on-surface-variant text-base md:text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
          {subtext}
        </p>
        <Link
          href={`${prefix}/contact`}
          className="inline-flex bg-gradient-to-r from-primary to-primary-container text-on-primary px-10 py-4 rounded-lg font-headline font-bold text-lg hover:opacity-90 transition-all duration-300 cursor-pointer shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  )
}
