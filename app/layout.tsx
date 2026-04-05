// Root layout — actual layout is in app/[locale]/layout.tsx
// This file exists to satisfy Next.js requirements for a root layout,
// but the real HTML shell is in the locale-specific layout.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
