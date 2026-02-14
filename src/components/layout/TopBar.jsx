import { Search, Bell, Menu, LogOut } from 'lucide-react'
import { authService } from '../../api'

export default function TopBar({ onMobileMenuToggle }) {
  const user = authService.getUser()
  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <header className="h-16 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Search */}
        <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 gap-2 w-64">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search players..."
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-hidden w-full"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-befa-green rounded-full animate-pulse-dot" />
        </button>

        {/* Admin avatar + logout */}
        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-zinc-800">
          <div className="w-8 h-8 rounded-full bg-befa-green/20 flex items-center justify-center">
            <span className="text-befa-green text-xs font-bold">{initials}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-white leading-tight">{user?.username || 'Admin'}</p>
            <p className="text-[10px] text-gray-500 leading-tight">{user?.email || ''}</p>
          </div>
          <button
            onClick={() => authService.logout()}
            className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
