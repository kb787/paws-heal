import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Book, Database } from 'lucide-react'

const Sidebar = () => {
  const pathname = usePathname()

  const navItems = [
    { name: 'Knowledge Base', href: '/', icon: Book },
    { name: 'Data Management', href: '/data-management', icon: Database },
  ]

  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
      <nav>
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center space-x-2 mb-4 p-2 rounded-lg",
              pathname === item.href
                ? "bg-blue-500 text-white"
                : "text-gray-700 hover:bg-gray-200"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar

