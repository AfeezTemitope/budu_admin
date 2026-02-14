import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserPlus, Search, MoreVertical, Eye, Edit, Download, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { usePlayers, useDeletePlayer } from '../../hooks'
import { playersService } from '../../api'
import { LoadingState, ErrorState, EmptyState, OfflineBanner } from '../../components/common/States'
import { getAge, getInitials } from '../../utils/helpers'

const statusStyles = {
  admitted: 'text-befa-green bg-befa-green/10',
  pending: 'text-amber-400 bg-amber-400/10',
  not_admitted: 'text-red-400 bg-red-400/10',
}

const positionColors = {
  Striker: 'text-orange-400 bg-orange-400/10',
  Midfielder: 'text-blue-400 bg-blue-400/10',
  Defender: 'text-purple-400 bg-purple-400/10',
  Goalkeeper: 'text-teal-400 bg-teal-400/10',
}

export default function PlayersList() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterPosition, setFilterPosition] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [activeMenu, setActiveMenu] = useState(null)

  const filters = {}
  if (search) filters.search = search
  if (filterPosition) filters.position = filterPosition
  if (filterStatus) filters.status = filterStatus

  const { data: players, loading, error, offline, execute: refetch } = usePlayers(filters)
  const { execute: deletePlayer } = useDeletePlayer()

  useEffect(() => {
    const close = () => setActiveMenu(null)
    if (activeMenu) document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [activeMenu])

  const handleDelete = async (e, id) => {
    e.stopPropagation()
    setActiveMenu(null)
    if (!confirm('Are you sure you want to delete this player?')) return
    try {
      await deletePlayer(id)
      toast.success('Player deleted')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Players</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {players?.length ?? 0} registered player{players?.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={() => navigate('/players/register')}
          className="flex items-center gap-2 px-4 py-2.5 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark transition-colors cursor-pointer">
          <UserPlus className="w-4 h-4" /> Register Player
        </button>
      </div>

      {offline && <OfflineBanner />}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 gap-2">
          <Search className="w-4 h-4 text-gray-500 shrink-0" />
          <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-white placeholder:text-gray-500 outline-hidden w-full" />
        </div>
        <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-hidden appearance-none cursor-pointer min-w-[140px]">
          <option value="">All Positions</option>
          <option value="Striker">Striker</option>
          <option value="Midfielder">Midfielder</option>
          <option value="Defender">Defender</option>
          <option value="Goalkeeper">Goalkeeper</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-gray-300 outline-hidden appearance-none cursor-pointer min-w-[130px]">
          <option value="">All Status</option>
          <option value="admitted">Admitted</option>
          <option value="pending">Pending</option>
          <option value="not_admitted">Not Admitted</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <LoadingState message="Loading players..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-zinc-800 text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Player</div>
            <div className="col-span-2">Position</div>
            <div className="col-span-1">Age</div>
            <div className="col-span-2">State</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>

          {(!players || players.length === 0) ? (
            <EmptyState title="No players found"
              description={offline ? "Connect your Django backend to manage players." : "Register your first player or adjust your filters."}
              action={
                <button onClick={() => navigate('/players/register')}
                  className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-medium text-befa-green bg-befa-green/10 border border-befa-green/20 rounded-lg hover:bg-befa-green/20 transition-colors cursor-pointer">
                  <UserPlus className="w-3.5 h-3.5" /> Register Player
                </button>
              }
            />
          ) : (
            <div className="divide-y divide-zinc-800">
              {players.map((player) => (
                <div key={player.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-zinc-800 transition-colors cursor-pointer items-center"
                  onClick={() => navigate(`/players/${player.id}`)}>

                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 overflow-hidden">
                      {player.player_image
                        ? <img src={player.player_image} alt="" className="w-full h-full object-cover" />
                        : <span className="text-xs font-semibold text-gray-400">{getInitials(`${player.surname} ${player.other_name}`)}</span>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{player.surname} {player.other_name}</p>
                      <p className="text-[11px] text-gray-500 md:hidden">{player.soccer_position} · Age {getAge(player.date_of_birth)}</p>
                    </div>
                  </div>

                  <div className="col-span-2 hidden md:block">
                    <span className={`text-[11px] font-medium px-2 py-1 rounded-full ${positionColors[player.soccer_position] || 'text-gray-400 bg-zinc-800'}`}>
                      {player.soccer_position}
                    </span>
                  </div>
                  <div className="col-span-1 hidden md:block">
                    <span className="text-sm text-gray-400">{getAge(player.date_of_birth)}</span>
                  </div>
                  <div className="col-span-2 hidden md:block">
                    <span className="text-sm text-gray-400">{player.state_of_origin}</span>
                  </div>
                  <div className="col-span-2 hidden md:flex items-center">
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusStyles[player.admission_status] || ''}`}>
                      {(player.admission_status || '').replace('_', ' ')}
                    </span>
                  </div>
                  <div className="col-span-1 hidden md:flex justify-end relative">
                    <button onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === player.id ? null : player.id) }}
                      className="p-1.5 text-gray-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    {activeMenu === player.id && (
                      <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-800 border border-zinc-700 rounded-lg shadow-xl z-10 py-1">
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenu(null); navigate(`/players/${player.id}`) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-300 hover:bg-zinc-700 cursor-pointer">
                          <Eye className="w-3.5 h-3.5" /> View Details</button>
                        <button onClick={(e) => { e.stopPropagation(); setActiveMenu(null) }}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-300 hover:bg-zinc-700 cursor-pointer">
                          <Edit className="w-3.5 h-3.5" /> Edit</button>
                        <a href={playersService.downloadPdf(player.id)} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-gray-300 hover:bg-zinc-700 cursor-pointer">
                          <Download className="w-3.5 h-3.5" /> Download PDF</a>
                        <hr className="border-zinc-700 my-1" />
                        <button onClick={(e) => handleDelete(e, player.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-xs text-red-400 hover:bg-red-400/5 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" /> Delete</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
