import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Leetcode Compare',
  description: 'Compare Leetcode Profiles and Analyze their Strengths and Weaknesses',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
