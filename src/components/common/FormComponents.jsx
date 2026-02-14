// ─── FormField ───
export function FormField({ label, required, children, hint, error }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-medium text-gray-400 tracking-wide">
          {label}
          {required && <span className="text-red-400 ml-0.5">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <p className="text-[11px] text-gray-600">{hint}</p>}
      {error && <p className="text-[11px] text-red-400">{error}</p>}
    </div>
  )
}

// ─── TextInput ───
export function TextInput({ value, onChange, placeholder, type = 'text', disabled, className = '', ...props }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`
        w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5
        text-sm text-white placeholder:text-gray-500
        hover:border-zinc-600
        focus:border-befa-green/60 focus:ring-1 focus:ring-befa-green/25
        outline-hidden transition-colors
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      {...props}
    />
  )
}

// ─── SelectInput ───
export function SelectInput({ value, onChange, options, placeholder, disabled, className = '' }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 pr-10
          text-sm text-white
          hover:border-zinc-600
          focus:border-befa-green/60 focus:ring-1 focus:ring-befa-green/25
          outline-hidden transition-colors appearance-none
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        <option value="" className="bg-zinc-900 text-gray-500">
          {placeholder || 'Select...'}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-zinc-900 text-white">
            {opt}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
        </svg>
      </div>
    </div>
  )
}

// ─── TextArea ───
export function TextArea({ value, onChange, placeholder, rows = 3, disabled, className = '' }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      className={`
        w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5
        text-sm text-white placeholder:text-gray-500
        hover:border-zinc-600
        focus:border-befa-green/60 focus:ring-1 focus:ring-befa-green/25
        outline-hidden transition-colors resize-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    />
  )
}

// ─── Toggle ───
export function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer group">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`
          relative w-11 h-6 rounded-full transition-colors shrink-0
          ${checked ? 'bg-befa-green' : 'bg-zinc-600'}
        `}
      >
        <span
          className={`
            absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
      </button>
      {label && (
        <span className="text-sm text-gray-300 group-hover:text-white transition-colors select-none">
          {label}
        </span>
      )}
    </label>
  )
}

// ─── CheckboxPill ───
export function CheckboxPill({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`
        px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer
        ${checked
          ? 'bg-befa-green/15 border-befa-green/40 text-befa-green'
          : 'bg-zinc-900 border-zinc-700 text-gray-500 hover:text-gray-300 hover:border-zinc-600'
        }
      `}
    >
      {label}
    </button>
  )
}

// ─── OptionButton (position picker, status picker) ───
export function OptionButton({ label, selected, onClick, color = 'green' }) {
  const styles = {
    green: selected
      ? 'bg-befa-green/15 border-befa-green/40 text-befa-green'
      : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-600',
    amber: selected
      ? 'bg-amber-400/15 border-amber-400/40 text-amber-400'
      : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-600',
    red: selected
      ? 'bg-red-400/15 border-red-400/40 text-red-400'
      : 'bg-zinc-900 border-zinc-700 text-gray-400 hover:text-white hover:border-zinc-600',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer ${styles[color]}`}
    >
      {label}
    </button>
  )
}

// ─── FormSection ───
export function FormSection({ icon: Icon, title, description, children }) {
  return (
    <div className="animate-fade-in-up">
      <div className="flex items-center gap-3 mb-5 pb-3 border-b border-zinc-800">
        {Icon && (
          <div className="w-8 h-8 rounded-lg bg-befa-green/10 flex items-center justify-center shrink-0">
            <Icon className="w-4 h-4 text-befa-green" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {description && <p className="text-[11px] text-gray-500 mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}
