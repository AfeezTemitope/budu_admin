import { Loader } from 'lucide-react'

const variants = {
  primary:
    'bg-befa-green text-black font-semibold hover:bg-befa-green-dark active:scale-[0.98]',
  secondary:
    'bg-zinc-800 text-gray-200 font-medium hover:bg-zinc-700 border border-zinc-700',
  ghost:
    'bg-transparent text-gray-400 font-medium hover:text-white hover:bg-zinc-800',
  danger:
    'bg-red-500/10 text-red-400 font-medium border border-red-500/20 hover:bg-red-500/20',
  outline:
    'bg-transparent text-gray-300 font-medium border border-zinc-800 hover:bg-zinc-800 hover:text-white',
  accent:
    'bg-befa-green/10 text-befa-green font-medium border border-befa-green/20 hover:bg-befa-green/20',
  warning:
    'bg-amber-400/10 text-amber-400 font-medium border border-amber-400/20 hover:bg-amber-400/20',
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-lg',
  lg: 'px-6 py-3 text-sm gap-2 rounded-xl',
  icon: 'p-2 rounded-lg',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconRight: IconRight,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      {loading ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
      {IconRight && !loading && <IconRight className="w-4 h-4 shrink-0" />}
    </button>
  )
}
