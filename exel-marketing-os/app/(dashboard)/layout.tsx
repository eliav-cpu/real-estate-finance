import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 mr-64 min-h-screen overflow-x-hidden">
        {children}
      </main>
    </div>
  )
}
