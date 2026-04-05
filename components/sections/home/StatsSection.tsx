'use client'

import { motion } from 'framer-motion'
import { AnimatedCounter } from '@/components/shared/AnimatedCounter'
import { stats } from '@/lib/data/stats'

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  },
}

export function StatsSection() {
  return (
    <section className="bg-[#0A0F1E] w-full py-20 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className="text-center lg:text-left"
            >
              <div className="w-12 h-1 bg-[#EC4899] mb-4 mx-auto lg:mx-0" />
              <div className="font-display text-5xl md:text-6xl lg:text-7xl text-white">
                <AnimatedCounter
                  value={stat.numeric_value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <p className="font-heading text-[#F8FAFC]/60 text-sm md:text-base uppercase tracking-widest mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
