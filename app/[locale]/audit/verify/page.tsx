'use client'

import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyOtp, resendOtp } from '@/app/[locale]/audit/actions'
import { Loader, Mail, RefreshCw } from 'lucide-react'

export default function VerifyPage() {
  const searchParams = useSearchParams()
  const auditRequestId = searchParams.get('id') ?? ''

  const [error, setError] = useState<string | null>(null)
  const [resendMsg, setResendMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isResending, startResend] = useTransition()

  function handleVerify(formData: FormData) {
    setError(null)
    startTransition(async () => {
      try {
        await verifyOtp(formData)
      } catch (e) {
        if (e instanceof Error && !e.message.includes('NEXT_REDIRECT')) {
          setError(e.message)
        }
      }
    })
  }

  function handleResend() {
    setResendMsg(null)
    setError(null)
    startResend(async () => {
      try {
        await resendOtp(auditRequestId)
        setResendMsg('A new code has been sent to your email.')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to resend. Please try again.')
      }
    })
  }

  const inputClass = 'w-full bg-white border border-[#0A0F1E]/10 rounded-xl px-5 py-4 font-heading font-bold text-[#0A0F1E] text-3xl text-center tracking-[0.5em] placeholder:text-[#0A0F1E]/20 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:border-transparent transition-all duration-200'

  return (
    <main className="min-h-screen bg-white pt-20 md:pt-24 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-[#EC4899]/10 flex items-center justify-center mx-auto mb-6">
          <Mail className="w-8 h-8 text-[#EC4899]" />
        </div>
        <h1 className="font-heading font-bold text-[#0A0F1E] text-3xl mb-3">Check your email</h1>
        <p className="font-body text-[#0A0F1E]/60 text-base mb-8">
          We sent a 6-digit verification code to your email address. Enter it below to start your audit.
        </p>

        <form action={handleVerify} className="space-y-4">
          <input type="hidden" name="audit_request_id" value={auditRequestId} />
          <div>
            <label htmlFor="otp_code" className="sr-only">Verification code</label>
            <input
              id="otp_code"
              name="otp_code"
              type="text"
              inputMode="numeric"
              maxLength={6}
              pattern="[0-9]{6}"
              required
              placeholder="000000"
              className={inputClass}
              autoFocus
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-left">
              <p className="font-body text-red-700 text-sm">{error}</p>
            </div>
          )}

          {resendMsg && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-left">
              <p className="font-body text-green-700 text-sm">{resendMsg}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-[#EC4899] text-white font-heading font-semibold py-4 px-8 rounded-xl text-base hover:bg-[#EC4899]/90 disabled:opacity-60 transition-all duration-300 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4] flex items-center justify-center gap-3 shadow-lg shadow-[#EC4899]/20"
          >
            {isPending ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Verifying…
              </>
            ) : (
              'Verify & Start Audit'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#0A0F1E]/10">
          <p className="font-body text-[#0A0F1E]/50 text-sm mb-3">Didn&apos;t receive the code?</p>
          <button
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-2 font-heading font-semibold text-[#EC4899] text-sm hover:text-[#EC4899]/80 transition-colors duration-200 cursor-pointer disabled:opacity-60"
          >
            {isResending ? <Loader className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Resend code
          </button>
          <p className="mt-2 font-body text-[#0A0F1E]/30 text-xs">Code expires in 15 minutes</p>
        </div>
      </div>
    </main>
  )
}
