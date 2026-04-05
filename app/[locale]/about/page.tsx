export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { PageHero } from '@/components/shared/PageHero'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CtaBannerSimple } from '@/components/shared/CtaBannerSimple'
import { team as fallbackTeam } from '@/lib/data/team'
import type { TeamMember } from '@/lib/types'
import { ExternalLink, Target, Zap, Globe, Users } from 'lucide-react'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props): Promise<Metadata> {
  return {
    title: 'About Us | Cethos Media',
    description: 'AI-Powered. Human-Managed. Cethos Media is a global digital marketing agency serving India, UAE and Canada with results-guaranteed campaigns.',
    openGraph: {
      title: 'About Cethos Media',
      description: 'AI-powered. Human-managed. Results guaranteed.',
      locale,
    },
  }
}

export default async function AboutPage({ params: { locale } }: Props) {
  let teamList: TeamMember[] = []
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('agp_team_members')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
    teamList = (data as TeamMember[]) ?? []
  } catch {
    teamList = []
  }

  const displayTeam = teamList.length > 0
    ? teamList
    : (fallbackTeam as unknown as TeamMember[])

  const prefix = locale === 'en' ? '' : `/${locale}`

  const values = [
    {
      icon: Zap,
      title: 'AI-Powered Speed',
      desc: 'We use AI to generate, test, and iterate faster than any traditional agency. But AI only handles the grunt work — strategy and judgment remain human.',
    },
    {
      icon: Target,
      title: 'Results Guaranteed',
      desc: 'We set clear, measurable KPIs before every engagement. If we don\'t hit them, we work for free until we do.',
    },
    {
      icon: Globe,
      title: 'Multilingual by Nature',
      desc: 'Not translated — created natively. Our team produces campaigns in English, Arabic, French, Hindi and Punjabi with authentic local voice.',
    },
    {
      icon: Users,
      title: 'Long-Term Partnerships',
      desc: 'We don\'t do one-time projects. We build long-term growth relationships — with transparent reporting and regular strategy reviews.',
    },
  ]

  return (
    <main className="pt-20 md:pt-24 bg-white min-h-screen">
      <PageHero
        eyebrow="Our Story"
        heading="About Cethos Media"
        subheading="We started because we were frustrated with agencies that overpromised and underdelivered. So we built something different — AI-powered, human-managed, and results-obsessed."
      />

      {/* Mission */}
      <SectionWrapper className="bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="font-heading text-[#EC4899] font-semibold text-sm uppercase tracking-widest mb-4">Our Mission</p>
            <h2 className="font-display text-4xl md:text-6xl text-[#0A0F1E] leading-none tracking-wide uppercase">
              Make World-Class Marketing Accessible
            </h2>
            <p className="font-body text-[#0A0F1E]/60 text-lg leading-relaxed mt-6 max-w-2xl mx-auto">
              Great marketing shouldn&apos;t require a Fortune 500 budget. We use AI to give SMEs, political candidates, and growing businesses the same firepower as enterprise agencies — at a fraction of the cost.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0A0F1E] rounded-2xl p-8 text-white">
              <h3 className="font-heading font-bold text-xl text-[#EC4899] mb-3">India First</h3>
              <p className="font-body text-white/70 text-sm leading-relaxed">
                Our roots are in India — specifically Punjab, where we built our reputation running political and brand campaigns. We understand the market, the culture, and what it takes to win here.
              </p>
            </div>
            <div className="bg-[#FDF2F8] rounded-2xl p-8">
              <h3 className="font-heading font-bold text-xl text-[#0A0F1E] mb-3">Global Reach</h3>
              <p className="font-body text-[#0A0F1E]/70 text-sm leading-relaxed">
                From our India base, we serve the UAE&apos;s ambitious business community and Canada&apos;s thriving diaspora markets. One agency, three continents, consistent results.
              </p>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Values */}
      <SectionWrapper className="bg-[#FDF2F8]">
        <SectionHeader
          eyebrow="Our Values"
          heading="How We Work"
          subheading="Four principles that guide every campaign, every decision, every client relationship."
          centered
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {values.map((v) => (
            <div key={v.title} className="bg-white rounded-2xl p-8 border border-[#EC4899]/10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#FDF2F8] text-[#EC4899] mb-4">
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-[#0A0F1E] text-lg mb-2">{v.title}</h3>
              <p className="font-body text-[#0A0F1E]/60 text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* Team */}
      <SectionWrapper className="bg-white">
        <SectionHeader
          eyebrow="The Team"
          heading="People Behind the Results"
          subheading="Strategists, creatives, and technologists united by one goal — making your marketing work harder."
          centered
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {displayTeam.map((member) => (
            <div
              key={member.id ?? member.name}
              className="group bg-white rounded-2xl border border-[#EC4899]/10 p-6 text-center hover:border-[#EC4899]/40 hover:shadow-[0_8px_30px_rgba(236,72,153,0.12)] transition-all duration-300"
            >
              {/* Avatar placeholder */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#EC4899]/20 to-[#06B6D4]/20 mx-auto mb-4 flex items-center justify-center">
                <span className="font-display text-2xl text-[#EC4899]">
                  {member.name.charAt(0)}
                </span>
              </div>
              <h3 className="font-heading font-bold text-[#0A0F1E] text-base mb-1">{member.name}</h3>
              <p className="font-heading text-[#EC4899] text-xs font-semibold mb-3">{member.role}</p>
              {member.bio && (
                <p className="font-body text-[#0A0F1E]/60 text-xs leading-relaxed mb-4">{member.bio}</p>
              )}
              {(member.linkedin_url || member.twitter_url) && (
                <div className="flex items-center justify-center gap-3">
                  {(member.linkedin_url || member.twitter_url) && (
                    <a
                      href={member.linkedin_url ?? member.twitter_url ?? '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} profile`}
                      className="text-[#0A0F1E]/40 hover:text-[#EC4899] transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionWrapper>

      <CtaBannerSimple locale={locale} />
    </main>
  )
}
