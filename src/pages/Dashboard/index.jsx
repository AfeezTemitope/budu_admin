import { useNavigate } from 'react-router-dom'
import { Users, UserPlus, Trophy, ArrowRight, Calendar, AlertCircle } from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import { LoadingState, ErrorState, EmptyState, OfflineBanner } from '../../components/common/States'
import { useDashboardStats, useRecentPlayers, usePositionBreakdown } from '../../hooks'
import { getInitials, formatDate } from '../../utils/helpers'

const statusStyles = {
  admitted: 'text-befa-green bg-befa-green/10',
  pending: 'text-amber-400 bg-amber-400/10',
  not_admitted: 'text-red-400 bg-red-400/10',
}

const positionEmoji = { Strikers: '⚡', Midfielders: '🎯', Defenders: '🛡️', Goalkeepers: '🧤' }

export default function Dashboard() {
  const navigate = useNavigate()
  const { data: stats, loading: statsLoading, error: statsError, offline: statsOffline, execute: retryStats } = useDashboardStats()
  const { data: recentPlayers, loading: playersLoading, offline: playersOffline } = useRecentPlayers()
  const { data: positions, loading: positionsLoading } = usePositionBreakdown()

  const isOffline = statsOffline || playersOffline

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of BEFA operations</p>
      </div>

      {isOffline && <OfflineBanner />}

      {/* Stats */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-32 animate-pulse" />
          ))}
        </div>
      ) : statsError ? (
        <ErrorState message={statsError} onRetry={retryStats} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Users} label="Total Players" value={stats?.total_players ?? 0} change={stats?.total_change} color="green" />
          <StatCard icon={UserPlus} label="New This Month" value={stats?.new_this_month ?? 0} change={stats?.new_change} color="blue" />
          <StatCard icon={Trophy} label="Admitted" value={stats?.admitted ?? 0} color="green" />
          <StatCard icon={AlertCircle} label="Pending Review" value={stats?.pending ?? 0} color="amber" />
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button onClick={() => navigate('/players/register')}
          className="flex items-center gap-3 p-4 bg-befa-green/10 border border-befa-green/20 rounded-xl hover:bg-befa-green/15 transition-all group text-left cursor-pointer">
          <div className="w-10 h-10 bg-befa-green/20 rounded-lg flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-befa-green" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Register Player</p>
            <p className="text-[11px] text-gray-500">Add a new player to BEFA</p>
          </div>
          <ArrowRight className="w-4 h-4 text-befa-green ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button onClick={() => navigate('/players')}
          className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all group text-left cursor-pointer">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">View All Players</p>
            <p className="text-[11px] text-gray-500">Manage player records</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
        <button onClick={() => navigate('/schedule')}
          className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all group text-left cursor-pointer">
          <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <Calendar className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Schedule Training</p>
            <p className="text-[11px] text-gray-500">Manage sessions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-600 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </button>
      </div>

      {/* Recent Players */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800">
          <h2 className="text-sm font-semibold text-white">Recent Registrations</h2>
          <button onClick={() => navigate('/players')}
            className="text-xs text-befa-green hover:text-befa-green-light transition-colors cursor-pointer">View all</button>
        </div>
        {playersLoading ? (
          <LoadingState message="Loading recent players..." />
        ) : !recentPlayers || recentPlayers.length === 0 ? (
          <EmptyState title="No players registered yet" description="Register your first player to see them here." />
        ) : (
          <div className="divide-y divide-zinc-800">
            {recentPlayers.map((player) => (
              <div key={player.id}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-zinc-800 transition-colors cursor-pointer"
                onClick={() => navigate(`/players/${player.id}`)}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {player.player_image
                      ? <img src={player.player_image} alt="" className="w-full h-full object-cover" />
                      : <span className="text-xs font-semibold text-gray-400">{getInitials(`${player.surname} ${player.other_name}`)}</span>}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{player.surname} {player.other_name}</p>
                    <p className="text-[11px] text-gray-500">{player.soccer_position}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-gray-600 hidden sm:block">{formatDate(player.created_at)}</span>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[player.admission_status] || ''}`}>
                    {(player.admission_status || '').replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Position Breakdown */}
      {!positionsLoading && positions?.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {positions.map((pos) => (
            <div key={pos.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{positionEmoji[pos.label] || '⚽'}</div>
              <div className="text-lg font-bold text-white">{pos.count}</div>
              <div className="text-[11px] text-gray-500">{pos.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
