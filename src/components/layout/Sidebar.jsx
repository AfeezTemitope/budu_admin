import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserPlus, Calendar,
  Newspaper, ShoppingBag, Settings, ChevronLeft,
  ChevronRight, Shield,
} from 'lucide-react'
import { NAV_ITEMS } from '../../utils/constants'

const iconMap = {
  LayoutDashboard, Users, UserPlus, Calendar,
  Newspaper, ShoppingBag, Settings,
}

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-zinc-950 border-r border-zinc-800 z-40 flex flex-col sidebar-transition ${
        collapsed ? 'w-[68px]' : 'w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-zinc-800">
        <div className="flex items-center gap-3 min-w-0">
          <img src="/drilldown.png" alt="BEFA" className="w-9 h-7 object-contain shrink-0" />
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">BEFA Admin</p>
              <p className="text-[10px] text-gray-500 truncate">Management Portal</p>
            </div>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon] || Shield
          const active = isActive(item.path)

          return (
            <NavLink
              key={item.key}
              to={item.soon ? '#' : item.path}
              onClick={(e) => item.soon && e.preventDefault()}
              className={`relative group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                active
                  ? 'bg-befa-green/10 text-befa-green'
                  : item.soon
                  ? 'text-gray-600 cursor-not-allowed'
                  : 'text-gray-400 hover:text-white hover:bg-zinc-800'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-[18px] h-[18px] shrink-0 ${active ? 'text-befa-green' : ''}`} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.soon && (
                    <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded bg-zinc-800 text-gray-500 font-medium">
                      SOON
                    </span>
                  )}
                </>
              )}
              {active && (
                <span className="absolute left-0 w-[3px] h-6 bg-befa-green rounded-r" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Collapse */}
      <div className="px-2 pb-4">
        <button
          onClick={onToggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px]" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px]" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}
