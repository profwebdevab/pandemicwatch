import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { Activity, Map, Shield, Flag, Navigation, Scale, Terminal } from 'lucide-react'
import ServiceWorkerRegistrar from '@/components/ServiceWorkerRegistrar'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains' })

export const metadata: Metadata = {
  title: 'PandemicWatch — Vigilância Epidemiológica Global',
  description: 'Monitoramento de surtos, liberdades civis e guia de relocação em tempo real.',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'PandemicWatch' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/icon-192.png' },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
}

const NAV_LINKS = [
  { href: '/', label: 'Dashboard', Icon: Activity },
  { href: '/outbreaks', label: 'Surtos', Icon: Map },
  { href: '/freedom-index', label: 'Liberdade', Icon: Shield },
  { href: '/flag-theory', label: 'Flag Theory', Icon: Flag },
  { href: '/relocation', label: 'Relocação', Icon: Navigation },
  { href: '/legislation', label: 'Legislação', Icon: Scale },
]

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="scanlines min-h-full bg-[#0a0a0f] text-gray-200" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {/* Top navigation */}
        <nav className="sticky top-0 z-40 bg-[#0a0a0f]/95 backdrop-blur border-b border-[#00ff87]/10">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-14">
              <Link href="/" className="flex items-center gap-2 font-bold text-[#00ff87]" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
                <Activity className="w-5 h-5" />
                <span className="text-sm tracking-wider">PANDEMIC<span className="text-white">WATCH</span></span>
                <span className="hidden sm:inline text-xs text-gray-600" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>v2.0</span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(({ href, label, Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-400 hover:text-[#00ff87] hover:bg-[#00ff87]/5 rounded transition-all"
                    style={{ fontFamily: 'var(--font-jetbrains), monospace' }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                  </Link>
                ))}
              </div>

              {/* Mobile icons */}
              <div className="md:hidden flex items-center gap-1">
                {NAV_LINKS.slice(0, 4).map(({ href, Icon }) => (
                  <Link key={href} href={href} className="p-2 text-gray-400 hover:text-[#00ff87] transition-colors">
                    <Icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Live indicator */}
        <div className="bg-[#00ff87]/5 border-b border-[#00ff87]/10 px-4 py-1">
          <div className="max-w-7xl mx-auto flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#00ff87] rounded-full animate-pulse" />
            <span className="text-xs text-[#00ff87]/70" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>MONITORAMENTO EM TEMPO REAL</span>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-6">
          {children}
        </main>

        <footer className="border-t border-[#00ff87]/10 mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs text-gray-600" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              PandemicWatch — Dados de WHO, CDC, ECDC, ProMED
            </p>
            <p className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              Este sistema é informativo. Sempre consulte fontes oficiais.
            </p>
            <Link href="/admin" className="flex items-center gap-1 text-xs text-gray-800 hover:text-gray-600 transition-colors" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              <Terminal className="w-3 h-3" />
              admin
            </Link>
          </div>
        </footer>

        <ServiceWorkerRegistrar />
      </body>
    </html>
  )
}
