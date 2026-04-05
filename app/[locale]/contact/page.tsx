import type { Metadata } from 'next'
import { PageHero } from '@/components/shared/PageHero'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { ContactForm } from '@/components/sections/contact/ContactForm'
import { Mail, Phone, MapPin } from 'lucide-react'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return {
    title: 'Contact Us | Cethos Media',
    description: 'Ready to grow? Get a free strategy audit from Cethos Media. Serving businesses in India, UAE and Canada.',
    openGraph: {
      title: 'Contact Cethos Media',
      description: 'Get a free strategy audit from our team.',
      locale,
    },
  }
}

export default function ContactPage({ params: { locale } }: Props) {
  const contactInfo = [
    { icon: Mail, label: 'Email Us', value: 'hello@cethosmedia.com', href: 'mailto:hello@cethosmedia.com' },
    { icon: Phone, label: 'Call / WhatsApp', value: '+1 (437) 986-7355', href: 'tel:+14379867355' },
    { icon: MapPin, label: 'Offices', value: 'Punjab · Dubai · Toronto', href: null },
  ]

  return (
    <main className="pt-20 md:pt-24 bg-white min-h-screen">
      <PageHero
        eyebrow="Let's Talk Results"
        heading="Contact Us"
        subheading="Tell us about your business and goals. We'll come back with a free strategy audit and a clear plan to grow your revenue."
      />

      <SectionWrapper className="bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">

          {/* Left: Form */}
          <div className="lg:col-span-3">
            <h2 className="font-heading font-bold text-[#0A0F1E] text-2xl mb-6">
              Get Your Free Strategy Audit
            </h2>
            <ContactForm locale={locale} />
          </div>

          {/* Right: Contact info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#0A0F1E] rounded-2xl p-8">
              <p className="font-heading font-bold text-white text-lg mb-6">
                Reach Us Directly
              </p>
              <div className="space-y-5">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-[#EC4899]/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#EC4899]" />
                    </div>
                    <div>
                      <p className="font-heading text-white/40 text-xs uppercase tracking-wider mb-0.5">
                        {item.label}
                      </p>
                      {item.href ? (
                        <a
                          href={item.href}
                          className="font-body text-white text-sm hover:text-[#06B6D4] transition-colors duration-200"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="font-body text-white text-sm">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#FDF2F8] rounded-2xl p-6 border border-[#EC4899]/10">
              <p className="font-heading font-bold text-[#0A0F1E] text-base mb-2">
                What happens next?
              </p>
              <ol className="space-y-3">
                {[
                  'We review your form within 24 hours',
                  'A strategist schedules a 30-min discovery call',
                  'We deliver a free audit with clear recommendations',
                  'You decide if we\'re the right fit — no pressure',
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-[#EC4899] text-white text-xs font-heading font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>
                    <span className="font-body text-[#0A0F1E]/70 text-sm leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </main>
  )
}
