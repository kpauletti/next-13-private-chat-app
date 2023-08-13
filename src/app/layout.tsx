import './globals.css'
import type { Metadata } from 'next'
import { Montserrat, Yellowtail } from 'next/font/google'

const monsterrat = Montserrat({ subsets: ['latin'] })
export const yellowtail = Yellowtail({ subsets: ['latin'], weight: '400' })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${monsterrat.className}`}>{children}</body>
    </html>
  )
}
