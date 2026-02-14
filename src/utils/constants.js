export const POSITIONS = ['Striker', 'Midfielder', 'Defender', 'Goalkeeper']
export const GENDERS = ['Male', 'Female']
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
export const GENOTYPES = ['AA', 'AS', 'AC', 'SS', 'SC', 'CC']

export const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi',
  'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun',
  'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
]

export const RELATIONSHIPS = [
  'Father', 'Mother', 'Brother', 'Sister', 'Uncle', 'Aunt',
  'Grandfather', 'Grandmother', 'Guardian', 'Other',
]

export const WEAKNESSES_OPTIONS = [
  'Speed', 'Skills', 'Agility', 'Positioning', 'Shooting Ability',
  'Passes', 'Match Fitness', 'Heading', 'Dribbling', 'Tackling',
  'First Touch', 'Vision', 'Communication',
]

export const ACADEMIC_STATUS_OPTIONS = ['In School', 'Graduated', 'Dropped Out', 'Not Enrolled']

export const EVENT_TYPES = [
  { value: 'training', label: 'Training' },
  { value: 'match', label: 'Match' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'other', label: 'Other' },
]

export const JERSEY_COLORS = [
  'Green', 'White', 'Black', 'Red', 'Blue', 'Yellow', 'Orange',
]

export const EMPTY_PLAYER_FORM = {
  player_image: '',
  parent_guardian_name: '', parent_contact_address: '', parent_telephone: '',
  relationship_to_student: '', parent_hopes: '',
  surname: '', middle_name: '', other_name: '', contact_address: '',
  state_of_origin: '', lga: '', nationality: 'Nigerian',
  date_of_birth: '', telephone: '', gender: '', weight: '', height: '',
  academic_status: '', previous_team: '', reason_for_leaving: '',
  soccer_position: '', player_hopes: '', weaknesses: [],
  last_treated_sickness: '', blood_group: '', genotype: '',
  any_medical_problem: false, medical_problem_details: '',
  currently_on_medication: false,
  admission_status: 'pending', notes: '',
}

export const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { key: 'players', label: 'Players', path: '/players', icon: 'Users' },
  { key: 'register', label: 'Register Player', path: '/players/register', icon: 'UserPlus' },
  { key: 'schedule', label: 'Schedule', path: '/schedule', icon: 'Calendar' },
  { key: 'news', label: 'News / CMS', path: '/news', icon: 'Newspaper' },
  { key: 'store', label: 'Store', path: '/store', icon: 'ShoppingBag' },
  { key: 'settings', label: 'Settings', path: '/settings', icon: 'Settings', soon: true },
]
