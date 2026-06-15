import './globals.css'
import { AppProvider } from '@/contexts/AppContext'

export const metadata = {
  title: 'SHE Day 2026',
  description: 'Safety · Health · Environment Interactive Day',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  )
}