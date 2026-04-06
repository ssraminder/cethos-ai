'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CaseStudyCard } from '@/components/shared/CaseStudyCard'
import { caseStudies as fallbackCaseStudies } from '@/lib/data/case-studies'
import type { CaseStudy } from '@/lib/types'
import { getGraphic, type SiteGraphic } from '@/lib/graphics'

// Maps case study slugs → graphic slot names in agp_graphics
const SLUG_TO_SLOT: Record<string, string> = {
  'dubai-real-estate-leads':           'dubai-real-estate',
  'canada-immigration-cpl-reduction':  'canada-immigration',
  'chandigarh-sme-organic-growth':     'chandigarh-sme',
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

interface WorkPreviewProps {
  caseStudies?: CaseStudy[]
  graphics?: SiteGraphic[]
}

export function WorkPreview({ caseStudies, graphics = [] }: WorkPreviewProps) {
  const t = useTranslations('sections')
  const all = caseStudies && caseStudies.length > 0
    ? caseStudies
    : (fallbackCaseStudies as unknown as CaseStudy[])
  const preview = all.slice(0, 3)

  return (
    <SectionWrapper dark>
      <SectionHeader
        eyebrow={t('work_eyebrow')}
        heading={t('work_heading')}
        subheading={t('work_sub')}
        centered
        light
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {preview.map((cs) => (
          <motion.div key={cs.slug} variants={itemVariants}>
            <CaseStudyCard
              caseStudy={cs}
              graphic={getGraphic(graphics, 'case-studies', SLUG_TO_SLOT[cs.slug] ?? cs.slug)}
            />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 text-center">
        <Link
          href="/case-studies"
          className="font-heading font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
        >
          {t('work_viewall')} &rarr;
        </Link>
      </div>
    </SectionWrapper>
  )
}
