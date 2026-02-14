import { Clock, CheckCircle } from 'lucide-react'

export default function ComingSoonPage({ title, description, features = [] }) {
  return (
    <div className="max-w-2xl mx-auto py-12 text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Clock className="w-10 h-10 text-befa-green" />
        <span className="text-xs font-semibold text-befa-green bg-befa-green/10 px-3 py-1.5 rounded-full">
          COMING SOON
        </span>
      </div>

      <h1 className="text-2xl font-bold text-white mb-3">{title}</h1>
      <p className="text-sm text-gray-400 mb-8 max-w-md mx-auto">{description}</p>

      {features.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-left">
          <h2 className="text-sm font-semibold text-white mb-4">Planned Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {features.map((f, i) => (
              <div key={i} className="flex items-center gap-2 p-2.5 bg-zinc-800 rounded-lg">
                <CheckCircle className="w-4 h-4 text-gray-600 shrink-0" />
                <span className="text-xs text-gray-400">{f}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
