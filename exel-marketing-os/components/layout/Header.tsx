import { Bell } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          {actions}
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={17} />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-brand-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">E</span>
            </div>
            <span className="text-sm text-gray-700 font-medium">EXEL</span>
          </div>
        </div>
      </div>
    </header>
  )
}
