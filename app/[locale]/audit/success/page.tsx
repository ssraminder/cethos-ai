import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, Mail, FileText } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Payment Confirmed | Ascelo AI',
  description: 'Your comprehensive SEO audit is being generated. Check your inbox in ~15 minutes.',
}

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { id?: string; session_id?: string }
}) {
  return (
    <main className="min-h-screen bg-white pt-20 md:pt-24 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 py-16 text-center">
        {/* Success icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        <h1 className="font-heading font-bold text-[#0A0F1E] text-3xl mb-3">
          Payment confirmed!
        </h1>
        <p className="font-body text-[#0A0F1E]/60 text-base mb-10 leading-relaxed">
          Your comprehensive SEO report is being generated. This usually takes 10–15 minutes.
        </p>

        {/* Steps */}
        <div className="space-y-4 mb-10 text-left">
          {[
            { icon: CheckCircle, color: 'text-green-600 bg-green-50', label: 'Payment received', status: 'Done' },
            { icon: Clock, color: 'text-amber-600 bg-amber-50', label: '50-page crawl in progress', status: 'Running' },
            { icon: FileText, color: 'text-[#0A0F1E]/40 bg-[#0A0F1E]/5', label: 'AI recommendations being written', status: 'Pending' },
            { icon: Mail, color: 'text-[#0A0F1E]/40 bg-[#0A0F1E]/5', label: 'Report delivered to your inbox', status: 'Pending' },
          ].map(({ icon: Icon, color, label, status }) => (
            <div key={label} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-body text-[#0A0F1E] text-sm">{label}</p>
              </div>
              <span className="font-heading font-semibold text-xs text-[#0A0F1E]/40">{status}</span>
            </div>
          ))}
        </div>

        <p className="font-body text-[#0A0F1E]/40 text-sm mb-8">
          You can close this page — we&apos;ll send the full report to your email address once it&apos;s ready.
        </p>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 font-heading font-semibold text-[#EC4899] text-sm hover:text-[#EC4899]/80 transition-colors duration-200"
        >
          Questions? Contact our team →
        </Link>
      </div>
    </main>
  )
}
