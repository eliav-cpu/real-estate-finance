import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'EXEL Marketing OS | מרכז פיקוד',
  description: 'EXEL Marketing Performance OS — מערכת ניהול פרסום, לידים ו-ROI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${inter.variable} font-sans antialiased bg-gray-50 text-gray-900`}>
        {children}
      </body>
    </html>
  )
}
