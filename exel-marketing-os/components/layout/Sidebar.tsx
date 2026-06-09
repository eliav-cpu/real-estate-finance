'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, TrendingUp, FileText, BarChart3, Calendar,
  GitMerge, DollarSign, Megaphone, CheckSquare, AlertTriangle,
  Settings, LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/',          label: 'מרכז פיקוד',       icon: LayoutDashboard },
  { href: '/records',   label: 'נתוני פרסום',     icon: TrendingUp      },
  { href: '/invoices',  label: 'חשבוניות',         icon: FileText        },
  { href: '/campaigns', label: 'קמפיינים',           icon: Megaphone       },
  { href: '/funnel',    label: 'משפך שיווקי',    icon: GitMerge        },
  { href: '/channels',  label: 'ביצועי ערוצים',  icon: BarChart3       },
  { href: '/monthly',   label: 'מגמה חודשית',   icon: Calendar        },
  { href: '/budget',    label: 'תקציב מול ביצוע',  icon: DollarSign      },
  { href: '/tasks',     label: 'משימות',             icon: CheckSquare     },
  { href: '/qa',        label: 'QA ואיכות נתונים', icon: AlertTriangle   },
  { href: '/settings',  label: 'הגדרות',             icon: Settings        },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed top-0 right-0 h-full w-64 bg-white border-l border-gray-100 flex flex-col z-40 shadow-sm">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-brand-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm tracking-tight">EX</span>
          </div>
          <div className="min-w-0">
            <div className="font-bold text-gray-900 text-sm leading-tight">EXEL</div>
            <div className="text-xs text-gray-400 leading-tight">Marketing OS</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-3">
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                    active
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    size={15}
                    className={cn(
                      'flex-shrink-0',
                      active ? 'text-brand-600' : 'text-gray-400'
                    )}
                  />
                  <span className="truncate">{label}</span>
                  {active && (
                    <span className="mr-auto w-1.5 h-1.5 rounded-full bg-brand-600 flex-shrink-0" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <p className="text-xs text-gray-400 mb-3 px-2">נדל&quot;ן שנבדק &mdash; v2.0</p>
        <button
          onClick={async () => {
            const { createClient } = await import('@/lib/supabase/client')
            await createClient().auth.signOut()
            window.location.href = '/login'
          }}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 px-2 py-2 rounded-lg hover:bg-red-50 w-full transition-colors"
        >
          <LogOut size={14} />
          <span>התנתק</span>
        </button>
      </div>
    </aside>
  )
}
