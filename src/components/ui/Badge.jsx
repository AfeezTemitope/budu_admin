const badgeVariants = {
  green: 'text-befa-green bg-befa-green/10 border-befa-green/20',
  amber: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  red: 'text-red-400 bg-red-400/10 border-red-400/20',
  blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
  teal: 'text-teal-400 bg-teal-400/10 border-teal-400/20',
  orange: 'text-orange-400 bg-orange-400/10 border-orange-400/20',
  gray: 'text-gray-400 bg-zinc-800 border-zinc-700',
}

const badgeSizes = {
  xs: 'text-[10px] px-1.5 py-0.5',
  sm: 'text-[11px] px-2 py-0.5',
  md: 'text-xs px-2.5 py-1',
}

export default function Badge({
  children,
  variant = 'gray',
  size = 'sm',
  border = false,
  className = '',
}) {
  return (
    <span
      className={`
        inline-flex items-center font-medium rounded-full
        ${badgeVariants[variant]}
        ${border ? 'border' : ''}
        ${badgeSizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const map = {
    admitted: { variant: 'green', label: 'Admitted' },
    pending: { variant: 'amber', label: 'Pending' },
    not_admitted: { variant: 'red', label: 'Not Admitted' },
  }
  const { variant, label } = map[status] || map.pending
  return <Badge variant={variant} size="xs">{label}</Badge>
}

export function PositionBadge({ position }) {
  const map = {
    Striker: 'orange',
    Midfielder: 'blue',
    Defender: 'purple',
    Goalkeeper: 'teal',
  }
  return <Badge variant={map[position] || 'gray'} size="sm">{position}</Badge>
}
