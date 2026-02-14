export function Input({ value, onChange, placeholder, type = 'text', disabled, className = '', ...props }) {
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

export function Select({ value, onChange, options = [], placeholder, disabled, className = '' }) {
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

export function Textarea({ value, onChange, placeholder, rows = 3, disabled, className = '' }) {
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
          ${checked ? 'bg-befa-green' : 'bg-zinc-700'}
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
