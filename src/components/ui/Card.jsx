export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={`
        bg-zinc-900 border border-zinc-800 rounded-xl
        ${hover ? 'hover:border-zinc-700 transition-colors' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '', border = true }) {
  return (
    <div className={`px-5 py-4 ${border ? 'border-b border-zinc-800' : ''} ${className}`}>
      {children}
    </div>
  )
}

export function CardBody({ children, className = '' }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}
