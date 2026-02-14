export default function StatCard({ icon: Icon, label, value, change, color = 'green' }) {
  const colors = {
    green: 'bg-befa-green/10 text-befa-green',
    blue: 'bg-blue-500/10 text-blue-400',
    amber: 'bg-amber-500/10 text-amber-400',
    red: 'bg-red-500/10 text-red-400',
  }

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
        {change && (
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            change > 0
              ? 'text-befa-green bg-befa-green/10'
              : 'text-red-400 bg-red-400/10'
          }`}>
            {change > 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}
