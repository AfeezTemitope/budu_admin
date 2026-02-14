import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, Edit, Download, User,
  Phone, MapPin, Calendar, Heart, Shield, Trophy,
} from 'lucide-react'
import { usePlayer } from '../../hooks'
import { playersService } from '../../api'
import { LoadingState, ErrorState } from '../../components/common/States'
import { getAge, formatDate } from '../../utils/helpers'

const statusStyles = {
  admitted: 'text-befa-green bg-befa-green/10 border-befa-green/20',
  pending: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  not_admitted: 'text-red-400 bg-red-400/10 border-red-400/20',
}

function InfoRow({ icon: Icon, label, value }) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3 py-2.5">
      <Icon className="w-4 h-4 text-gray-600 mt-0.5 shrink-0" />
      <div>
        <p className="text-[11px] text-gray-500">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  )
}

export default function PlayerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: player, loading, error, execute: retry } = usePlayer(id)

  if (loading) return <LoadingState message="Loading player details..." />
  if (error) return <ErrorState message={error} onRetry={retry} />
  if (!player) return <ErrorState message="Player not found" />

  const fullName = [player.surname, player.middle_name, player.other_name].filter(Boolean).join(' ')
  const age = getAge(player.date_of_birth)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/players')}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">{fullName}</h2>
            <p className="text-xs text-gray-500">{player.soccer_position} · ID #{id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a href={playersService.downloadPdf(id)} target="_blank" rel="noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" /> PDF
          </a>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-befa-green bg-befa-green/10 border border-befa-green/20 rounded-lg hover:bg-befa-green/15 transition-colors cursor-pointer">
            <Edit className="w-3.5 h-3.5" /> Edit
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-32 h-40 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0 overflow-hidden">
            {player.player_image
              ? <img src={player.player_image} alt={fullName} className="w-full h-full object-cover" />
              : <User className="w-10 h-10 text-gray-600" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xl font-bold text-white">{fullName}</h3>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border capitalize ${statusStyles[player.admission_status] || ''}`}>
                {(player.admission_status || '').replace('_', ' ')}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Position', value: player.soccer_position || '—' },
                { label: 'Age', value: age !== '—' ? `${age} years` : '—' },
                { label: 'Height', value: player.height ? `${player.height} cm` : '—' },
                { label: 'Weight', value: player.weight ? `${player.weight} kg` : '—' },
              ].map((s) => (
                <div key={s.label} className="bg-zinc-800 rounded-lg p-3 text-center">
                  <p className="text-sm font-bold text-befa-green">{s.value}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-befa-green" /> Personal Information
          </h3>
          <div className="space-y-1 divide-y divide-zinc-800">
            <InfoRow icon={MapPin} label="State / LGA" value={[player.state_of_origin, player.lga].filter(Boolean).join(', ') || null} />
            <InfoRow icon={MapPin} label="Address" value={player.contact_address} />
            <InfoRow icon={Phone} label="Phone" value={player.telephone} />
            <InfoRow icon={Calendar} label="Date of Birth" value={formatDate(player.date_of_birth)} />
            <InfoRow icon={Shield} label="Academic Status" value={player.academic_status} />
            <InfoRow icon={Trophy} label="Previous Team" value={player.previous_team} />
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-400" /> Parent / Guardian
          </h3>
          <div className="space-y-1 divide-y divide-zinc-800">
            <InfoRow icon={User} label="Name" value={player.parent_guardian_name} />
            <InfoRow icon={Shield} label="Relationship" value={player.relationship_to_student} />
            <InfoRow icon={Phone} label="Phone" value={player.parent_telephone} />
            <InfoRow icon={MapPin} label="Address" value={player.parent_contact_address} />
          </div>
          {player.parent_hopes && (
            <div className="mt-4 p-3 bg-zinc-800 rounded-lg">
              <p className="text-[11px] text-gray-500 mb-1">Hopes & Expectations</p>
              <p className="text-xs text-gray-300 leading-relaxed">{player.parent_hopes}</p>
            </div>
          )}
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" /> Medical Information
          </h3>
          <div className="space-y-1 divide-y divide-zinc-800">
            <InfoRow icon={Heart} label="Blood Group" value={player.blood_group} />
            <InfoRow icon={Heart} label="Genotype" value={player.genotype} />
            <InfoRow icon={Heart} label="Last Treated Sickness" value={player.last_treated_sickness} />
          </div>
          <div className="mt-3 flex gap-4">
            <span className={`text-[11px] px-2 py-1 rounded ${player.any_medical_problem ? 'text-red-400 bg-red-400/10' : 'text-befa-green bg-befa-green/10'}`}>
              Medical Issues: {player.any_medical_problem ? 'Yes' : 'No'}
            </span>
            <span className={`text-[11px] px-2 py-1 rounded ${player.currently_on_medication ? 'text-amber-400 bg-amber-400/10' : 'text-befa-green bg-befa-green/10'}`}>
              On Medication: {player.currently_on_medication ? 'Yes' : 'No'}
            </span>
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" /> Development
          </h3>
          {player.weaknesses?.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] text-gray-500 mb-2">Identified Weaknesses</p>
              <div className="flex flex-wrap gap-1.5">
                {player.weaknesses.map((w) => (
                  <span key={w} className="text-[10px] px-2 py-1 rounded-full bg-amber-400/10 text-amber-400 border border-amber-400/20">{w}</span>
                ))}
              </div>
            </div>
          )}
          {player.player_hopes && (
            <div className="p-3 bg-zinc-800 rounded-lg">
              <p className="text-[11px] text-gray-500 mb-1">Player's Goals</p>
              <p className="text-xs text-gray-300 leading-relaxed">{player.player_hopes}</p>
            </div>
          )}
          {player.notes && (
            <div className="mt-3 p-3 bg-befa-green/5 border border-befa-green/10 rounded-lg">
              <p className="text-[11px] text-befa-green mb-1">Admin Notes</p>
              <p className="text-xs text-gray-300 leading-relaxed">{player.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
