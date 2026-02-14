import { Loader, Inbox, AlertTriangle, RefreshCw, WifiOff } from 'lucide-react'

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <Loader className="w-8 h-8 text-befa-green animate-spin mb-3" />
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  )
}

export function EmptyState({ icon: Icon = Inbox, title = 'No data yet', description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <p className="text-sm font-medium text-gray-400 mb-1">{title}</p>
      {description && <p className="text-xs text-gray-600 mb-4 max-w-xs">{description}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message = 'Failed to load data', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
        <AlertTriangle className="w-6 h-6 text-red-400" />
      </div>
      <p className="text-sm font-medium text-red-400 mb-1">Error</p>
      <p className="text-xs text-gray-500 mb-4 max-w-xs">{message}</p>
      {onRetry && (
        <button onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer">
          <RefreshCw className="w-3.5 h-3.5" /> Try Again
        </button>
      )}
    </div>
  )
}

export function OfflineBanner() {
  return (
    <div className="mb-4 flex items-center gap-3 px-4 py-3 bg-amber-400/10 border border-amber-400/20 rounded-xl">
      <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
      <div>
        <p className="text-xs font-medium text-amber-400">Backend not connected</p>
        <p className="text-[11px] text-gray-500">Start your Django server at localhost:8000 to see real data</p>
      </div>
    </div>
  )
}
