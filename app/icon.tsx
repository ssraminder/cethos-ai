import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0A0F1E',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'sans-serif',
            fontWeight: 900,
            fontSize: 18,
            color: '#EC4899',
            letterSpacing: '-1px',
          }}
        >
          C
        </div>
      </div>
    ),
    { ...size }
  )
}
