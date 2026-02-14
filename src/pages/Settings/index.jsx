import ComingSoonPage from '../ComingSoon'

export default function SettingsPage() {
  return (
    <ComingSoonPage
      title="Settings"
      description="Configure academy details, admin accounts, and system preferences."
      features={[
        'Academy profile & branding',
        'Admin user management',
        'Role-based access control',
        'Notification preferences',
        'API keys & integrations',
        'Data export & backup',
      ]}
    />
  )
}
