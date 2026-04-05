'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SectionWrapper } from '@/components/shared/SectionWrapper'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { ServiceCard } from '@/components/shared/ServiceCard'
import { services } from '@/lib/data/services'

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
    transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export function ServicesPreview() {
  const preview = services.slice(0, 6)

  return (
    <SectionWrapper light>
      <SectionHeader
        eyebrow="Full-Service Agency"
        heading="Everything Your Brand Needs to Grow"
        subheading="From performance campaigns to brand strategy — we cover every channel, in every market we serve."
        centered
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {preview.map((service) => (
          <motion.div key={service.slug} variants={itemVariants}>
            <ServiceCard service={service} variant="compact" />
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-10 flex justify-end">
        <Link
          href="/services"
          className="font-heading font-semibold text-[#EC4899] hover:text-[#EC4899]/80 transition-colors duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] rounded"
        >
          View all services &rarr;
        </Link>
      </div>
    </SectionWrapper>
  )
}
