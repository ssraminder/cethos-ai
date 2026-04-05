'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { CaseStudyCard } from '@/components/shared/CaseStudyCard'
import { caseStudies } from '@/lib/data/case-studies'
import type { CaseStudy } from '@/lib/types'

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

export function WorkPreview() {
  const preview = caseStudies.slice(0, 3) as unknown as CaseStudy[]

  return (
    <SectionWrapper dark>
      <SectionHeader
        eyebrow="Proven Results"
        heading="Numbers Our Clients Actually Care About"
        subheading="Case studies from real campaigns across India, UAE and Canada."
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
            <CaseStudyCard caseStudy={cs} />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 text-center">
        <Link
          href="/case-studies"
          className="font-heading font-semibold text-[#06B6D4] hover:text-[#06B6D4]/80 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
        >
          View all case studies &rarr;
        </Link>
      </div>
    </SectionWrapper>
  )
}
