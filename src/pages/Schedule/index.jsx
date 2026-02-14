import { useState, useCallback } from 'react'
import { Plus, Edit, Trash2, Calendar, Clock, MapPin, X, Save, Loader } from 'lucide-react'
import toast from 'react-hot-toast'
import { useApi, useMutation } from '../../hooks'
import { scheduleService } from '../../api'
import { EVENT_TYPES, JERSEY_COLORS } from '../../utils/constants'
import { LoadingState, ErrorState, EmptyState } from '../../components/common/States'

const typeColors = {
  training: 'text-befa-green bg-befa-green/10',
  match: 'text-blue-400 bg-blue-400/10',
  meeting: 'text-amber-400 bg-amber-400/10',
  other: 'text-gray-400 bg-zinc-800',
}

const EMPTY_EVENT = {
  title: '', event_type: 'training', date: '', time: '', venue: '', jersey_color: '', description: '',
}

export default function SchedulePage() {
  const fetchEvents = useCallback(() => scheduleService.list(), [])
  const { data: events, loading, error, execute: refetch } = useApi(fetchEvents, [], { initialData: [] })
  const { execute: createEvent, loading: creating } = useMutation(scheduleService.create)
  const { execute: updateEvent, loading: updating } = useMutation((id, data) => scheduleService.update(id, data))
  const { execute: deleteEvent } = useMutation(scheduleService.delete)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_EVENT })

  const update = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }))

  const openCreate = () => {
    setForm({ ...EMPTY_EVENT })
    setEditingId(null)
    setShowForm(true)
  }

  const openEdit = (event) => {
    setForm({
      title: event.title || '',
      event_type: event.event_type || 'training',
      date: event.date || '',
      time: event.time?.slice(0, 5) || '',
      venue: event.venue || '',
      jersey_color: event.jersey_color || '',
      description: event.description || '',
    })
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!form.date || !form.time || !form.venue) {
      toast.error('Date, time, and venue are required')
      return
    }
    try {
      if (editingId) {
        await updateEvent(editingId, form)
        toast.success('Event updated')
      } else {
        await createEvent(form)
        toast.success('Event created')
      }
      setShowForm(false)
      setEditingId(null)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to save')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return
    try {
      await deleteEvent(id)
      toast.success('Event deleted')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Failed to delete')
    }
  }

  // Handle paginated results
  const eventList = Array.isArray(events) ? events : events?.results || []

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Training Schedule</h1>
          <p className="text-sm text-gray-500 mt-0.5">{eventList.length} event{eventList.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark transition-colors cursor-pointer">
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-white">{editingId ? 'Edit Event' : 'New Training Event'}</h2>
            <button onClick={() => setShowForm(false)} className="p-1 text-gray-500 hover:text-white cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Title</label>
              <input value={form.title} onChange={update('title')} placeholder="e.g. Morning Training"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Type</label>
              <select value={form.event_type} onChange={update('event_type')}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-hidden appearance-none cursor-pointer focus:border-befa-green/60 transition-colors">
                {EVENT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Date *</label>
              <input type="date" value={form.date} onChange={update('date')}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Time *</label>
              <input type="time" value={form.time} onChange={update('time')}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Venue *</label>
              <input value={form.venue} onChange={update('venue')} placeholder="Training ground"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden focus:border-befa-green/60 transition-colors" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-400">Jersey Color</label>
              <select value={form.jersey_color} onChange={update('jersey_color')}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white outline-hidden appearance-none cursor-pointer focus:border-befa-green/60 transition-colors">
                <option value="">Select color</option>
                {JERSEY_COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            <label className="text-xs font-medium text-gray-400">Description</label>
            <textarea value={form.description} onChange={update('description')} rows={2} placeholder="Optional notes..."
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-500 outline-hidden resize-none focus:border-befa-green/60 transition-colors" />
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button onClick={() => setShowForm(false)}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
            <button onClick={handleSave} disabled={creating || updating}
              className="flex items-center gap-2 px-5 py-2 bg-befa-green text-black text-sm font-semibold rounded-lg hover:bg-befa-green-dark transition-colors disabled:opacity-50 cursor-pointer">
              {(creating || updating) ? <Loader className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {editingId ? 'Update' : 'Create'}
            </button>
          </div>
        </div>
      )}

      {/* Events List */}
      {loading ? <LoadingState message="Loading schedule..." /> :
       error ? <ErrorState message={error} onRetry={refetch} /> :
       eventList.length === 0 ? (
        <EmptyState title="No events scheduled" description="Create your first training session or event."
          action={<button onClick={openCreate}
            className="mt-2 flex items-center gap-2 px-4 py-2 text-xs font-medium text-befa-green bg-befa-green/10 border border-befa-green/20 rounded-lg hover:bg-befa-green/20 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Add Event
          </button>} />
      ) : (
        <div className="space-y-3">
          {eventList.map((event) => (
            <div key={event.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-zinc-800 rounded-lg flex flex-col items-center justify-center shrink-0">
                    <span className="text-[10px] text-gray-500 uppercase">
                      {event.date ? new Date(event.date + 'T00:00:00').toLocaleDateString('en-NG', { month: 'short' }) : ''}
                    </span>
                    <span className="text-lg font-bold text-white leading-tight">
                      {event.date ? new Date(event.date + 'T00:00:00').getDate() : ''}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-semibold text-white">{event.title || event.event_type}</h3>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${typeColors[event.event_type] || typeColors.other}`}>
                        {event.event_type}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.time?.slice(0, 5)}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{event.venue}</span>
                      {event.jersey_color && (
                        <span className="flex items-center gap-1">
                          <span className="w-3 h-3 rounded-full border border-zinc-600" style={{ backgroundColor: event.jersey_color.toLowerCase() }} />
                          {event.jersey_color} jersey
                        </span>
                      )}
                    </div>
                    {event.description && <p className="text-xs text-gray-500 mt-2">{event.description}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => openEdit(event)}
                    className="p-2 text-gray-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(event.id)}
                    className="p-2 text-gray-500 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
