import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserCircle, Users, Heart, Clipboard, Save,
  Download, ArrowLeft, CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'
import {
  FormField, FormSection, TextInput, SelectInput,
  TextArea, Toggle, CheckboxPill, OptionButton,
} from '../common/FormComponents'
import ImageUpload from '../common/ImageUpload'
import PdfUpload from './PdfUpload'
import { useCreatePlayer } from '../../hooks'
import { playersService } from '../../api'
import {
  POSITIONS, GENDERS, BLOOD_GROUPS, GENOTYPES,
  NIGERIAN_STATES, RELATIONSHIPS, WEAKNESSES_OPTIONS,
  ACADEMIC_STATUS_OPTIONS, EMPTY_PLAYER_FORM,
} from '../../utils/constants'

export default function PlayerRegistrationForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...EMPTY_PLAYER_FORM })
  const [showPdfUpload, setShowPdfUpload] = useState(false)
  const { execute: createPlayer, loading: saving } = useCreatePlayer()

  const update = (field) => (e) => {
    const value = e?.target ? e.target.value : e
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleWeakness = (w) => {
    setForm((prev) => ({
      ...prev,
      weaknesses: prev.weaknesses.includes(w)
        ? prev.weaknesses.filter((x) => x !== w)
        : [...prev.weaknesses, w],
    }))
  }

  const handleExtractedData = (data) => {
    setForm((prev) => ({ ...prev, ...data }))
    toast.success('Form auto-filled from PDF')
  }

  const handleSave = async () => {
    if (!form.surname || !form.parent_guardian_name) {
      toast.error('Please fill in required fields')
      return
    }
    try {
      const player = await createPlayer(form)
      toast.success('Player registered successfully')
      navigate(`/players/${player.id}`)
    } catch (err) {
      toast.error(err.message || 'Failed to register player')
    }
  }

  const handleDownloadPdf = () => {
    toast('PDF generation requires a saved player record', { icon: 'ℹ️' })
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/players')}
            className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-white">Register New Player</h2>
            <p className="text-xs text-gray-500">Fill in the BEFA registration form</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setShowPdfUpload(!showPdfUpload)}
            className="px-3 py-2 text-xs font-medium text-amber-400 bg-amber-400/10 border border-amber-400/20 rounded-lg hover:bg-amber-400/20 transition-colors cursor-pointer">
            Upload Existing PDF
          </button>
          <button type="button" onClick={handleDownloadPdf}
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 transition-colors cursor-pointer">
            <Download className="w-3.5 h-3.5" /> Download PDF
          </button>
        </div>
      </div>

      {showPdfUpload && (
        <div className="mb-6 animate-fade-in-up">
          <PdfUpload onExtracted={handleExtractedData} />
        </div>
      )}

      <div className="space-y-6 stagger-children">
        {/* Photo */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <FormSection icon={UserCircle} title="Player Photo" description="Upload a passport-style photo">
            <ImageUpload value={form.player_image} onChange={update('player_image')} />
          </FormSection>
        </div>

        {/* Parent / Guardian */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <FormSection icon={Users} title="Parent / Guardian Information" description="As shown on the BEFA registration form">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Parent/Guardian Name" required>
                <TextInput value={form.parent_guardian_name} onChange={update('parent_guardian_name')} placeholder="Full name" />
              </FormField>
              <FormField label="Relationship to Student" required>
                <SelectInput value={form.relationship_to_student} onChange={update('relationship_to_student')} options={RELATIONSHIPS} placeholder="Select relationship" />
              </FormField>
            </div>
            <FormField label="Contact Address">
              <TextInput value={form.parent_contact_address} onChange={update('parent_contact_address')} placeholder="Home address" />
            </FormField>
            <FormField label="Telephone">
              <TextInput value={form.parent_telephone} onChange={update('parent_telephone')} placeholder="080XXXXXXXX" type="tel" />
            </FormField>
            <FormField label="What do you hope your child will accomplish with BEFA?">
              <TextArea value={form.parent_hopes} onChange={update('parent_hopes')} placeholder="Parent/guardian's hopes and expectations..." rows={3} />
            </FormField>
          </FormSection>
        </div>

        {/* Student / Player */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <FormSection icon={UserCircle} title="Student / Player Information" description="Player's personal and football details">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField label="Surname" required>
                <TextInput value={form.surname} onChange={update('surname')} placeholder="Last name" />
              </FormField>
              <FormField label="Middle Name">
                <TextInput value={form.middle_name} onChange={update('middle_name')} placeholder="Middle name" />
              </FormField>
              <FormField label="Other Name">
                <TextInput value={form.other_name} onChange={update('other_name')} placeholder="First / other name" />
              </FormField>
            </div>
            <FormField label="Contact Address">
              <TextInput value={form.contact_address} onChange={update('contact_address')} placeholder="Player's address" />
            </FormField>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField label="State of Origin" required>
                <SelectInput value={form.state_of_origin} onChange={update('state_of_origin')} options={NIGERIAN_STATES} placeholder="Select state" />
              </FormField>
              <FormField label="LGA">
                <TextInput value={form.lga} onChange={update('lga')} placeholder="Local Govt. Area" />
              </FormField>
              <FormField label="Nationality">
                <TextInput value={form.nationality} onChange={update('nationality')} placeholder="Nationality" />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField label="Date of Birth" required>
                <TextInput type="date" value={form.date_of_birth} onChange={update('date_of_birth')} />
              </FormField>
              <FormField label="Telephone">
                <TextInput value={form.telephone} onChange={update('telephone')} placeholder="080XXXXXXXX" type="tel" />
              </FormField>
              <FormField label="Gender" required>
                <SelectInput value={form.gender} onChange={update('gender')} options={GENDERS} placeholder="Select gender" />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField label="Weight" hint="In kg">
                <TextInput value={form.weight} onChange={update('weight')} placeholder="e.g. 65" />
              </FormField>
              <FormField label="Height" hint="In cm">
                <TextInput value={form.height} onChange={update('height')} placeholder="e.g. 175" />
              </FormField>
              <FormField label="Academic Status">
                <SelectInput value={form.academic_status} onChange={update('academic_status')} options={ACADEMIC_STATUS_OPTIONS} placeholder="Select status" />
              </FormField>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField label="Previous Team">
                <TextInput value={form.previous_team} onChange={update('previous_team')} placeholder="Previous club/academy" />
              </FormField>
              <FormField label="Reason for Leaving">
                <TextInput value={form.reason_for_leaving} onChange={update('reason_for_leaving')} placeholder="Why did you leave?" />
              </FormField>
            </div>
            <FormField label="Soccer Position" required>
              <div className="flex flex-wrap gap-2">
                {POSITIONS.map((pos) => (
                  <OptionButton key={pos} label={pos} selected={form.soccer_position === pos}
                    onClick={() => setForm((prev) => ({ ...prev, soccer_position: pos }))} />
                ))}
              </div>
            </FormField>
            <FormField label="What do you hope to accomplish with BEFA?">
              <TextArea value={form.player_hopes} onChange={update('player_hopes')} placeholder="Player's goals and aspirations..." rows={3} />
            </FormField>
            <FormField label="Present Weaknesses" hint="Select all that apply">
              <div className="flex flex-wrap gap-2">
                {WEAKNESSES_OPTIONS.map((w) => (
                  <CheckboxPill key={w} label={w} checked={form.weaknesses.includes(w)} onChange={() => toggleWeakness(w)} />
                ))}
              </div>
            </FormField>
          </FormSection>
        </div>

        {/* Medical */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <FormSection icon={Heart} title="Medical Information" description="Health and medical details">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <FormField label="Last Treated Sickness">
                <TextInput value={form.last_treated_sickness} onChange={update('last_treated_sickness')} placeholder="Recent illness" />
              </FormField>
              <FormField label="Blood Group">
                <SelectInput value={form.blood_group} onChange={update('blood_group')} options={BLOOD_GROUPS} placeholder="Select blood group" />
              </FormField>
              <FormField label="Genotype">
                <SelectInput value={form.genotype} onChange={update('genotype')} options={GENOTYPES} placeholder="Select genotype" />
              </FormField>
            </div>
            <div className="space-y-4">
              <Toggle checked={form.any_medical_problem} onChange={(v) => setForm((p) => ({ ...p, any_medical_problem: v }))} label="Any medical problem?" />
              {form.any_medical_problem && (
                <FormField label="If yes, please state">
                  <TextArea value={form.medical_problem_details} onChange={update('medical_problem_details')} placeholder="Describe medical condition..." rows={2} />
                </FormField>
              )}
            </div>
            <Toggle checked={form.currently_on_medication} onChange={(v) => setForm((p) => ({ ...p, currently_on_medication: v }))} label="Currently being treated or taking medications?" />
          </FormSection>
        </div>

        {/* Office Use */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <FormSection icon={Clipboard} title="For Office Use" description="Internal admission status and notes">
            <FormField label="Admission Status">
              <div className="flex flex-wrap gap-2">
                {[
                  { value: 'pending', label: 'Pending', color: 'amber' },
                  { value: 'admitted', label: 'Admitted', color: 'green' },
                  { value: 'not_admitted', label: 'Not Admitted', color: 'red' },
                ].map((s) => (
                  <OptionButton key={s.value} label={s.label} selected={form.admission_status === s.value}
                    onClick={() => setForm((p) => ({ ...p, admission_status: s.value }))} color={s.color} />
                ))}
              </div>
            </FormField>
            <FormField label="Notes">
              <TextArea value={form.notes} onChange={update('notes')} placeholder="Admin notes about this player..." rows={3} />
            </FormField>
          </FormSection>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between py-4">
          <button type="button" onClick={() => navigate('/players')}
            className="px-4 py-2.5 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Cancel</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-black bg-befa-green rounded-lg hover:bg-befa-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
            {saving ? (
              <><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-4 h-4" /> Register Player</>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
