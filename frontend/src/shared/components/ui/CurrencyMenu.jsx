import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'

const STORAGE_KEY = 'velore_currency'

const OPTIONS = [
  { code: 'USD', label: 'United States Dollar' },
  { code: 'EUR', label: 'Euro' },
  { code: 'GBP', label: 'British Pound' },
  { code: 'LBP', label: 'Lebanese Pound' },
]

function safeReadCurrency() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v && OPTIONS.some((o) => o.code === v)) return v
  } catch {
    // ignore
  }
  return 'USD'
}

function safeWriteCurrency(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    // ignore
  }
}

export default function CurrencyMenu({
  ariaLabel = 'Currency',
  align = 'right',
  triggerClassName = '',
  menuClassName = '',
  onChange,
}) {
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const [open, setOpen] = useState(false)
  const [currency, setCurrency] = useState(safeReadCurrency)

  const current = useMemo(() => OPTIONS.find((o) => o.code === currency) || OPTIONS[0], [currency])

  useEffect(() => {
    if (!open) return
    const onDocPointer = (e) => {
      const el = rootRef.current
      if (!el) return
      if (!el.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus?.()
      }
    }
    document.addEventListener('pointerdown', onDocPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDocPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const select = (code) => {
    setCurrency(code)
    safeWriteCurrency(code)
    onChange?.(code)
    setOpen(false)
    // Return focus to trigger for keyboard users.
    buttonRef.current?.focus?.()
  }

  const side = align === 'left' ? 'left-0' : 'right-0'

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        className={[
          // Stable trigger width to prevent navbar jump.
          'inline-flex items-center justify-between gap-2',
          'h-9 w-[86px] px-3 rounded-xl',
          'bg-transparent',
          'text-xs font-semibold tracking-wide',
          'border border-[rgba(var(--velore-border-soft),0.9)]',
          'hover:bg-[rgba(var(--velore-accent),0.06)]',
          'text-gray-800',
          'v-motion',
          'focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--velore-ring),0.16)]',
          triggerClassName,
        ].join(' ')}
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen((v) => !v)}
      >
        <span className="tabular-nums">{current.code}</span>
        <ChevronDown size={16} aria-hidden="true" className={open ? 'rotate-180 v-motion' : 'v-motion'} />
      </button>

      {open && (
        <div
          role="menu"
          className={[
            'absolute top-full mt-2 z-50',
            side,
            'min-w-[240px]',
            'v-popover v-popover-anim',
            'p-1',
            menuClassName,
          ].join(' ')}
          style={{
            // Viewport clamping without heavy positioning libs:
            maxWidth: 'calc(100vw - 24px)',
          }}
        >
          {OPTIONS.map((o) => {
            const selected = o.code === currency
            return (
              <button
                key={o.code}
                type="button"
                role="menuitem"
                className={[
                  'w-full flex items-center justify-between gap-3',
                  'px-3 py-2.5 rounded-xl text-left',
                  'v-menu-item',
                  'focus:outline-none focus-visible:ring-4 focus-visible:ring-[rgba(var(--velore-ring),0.16)]',
                ].join(' ')}
                aria-current={selected ? 'true' : 'false'}
                aria-pressed={selected ? 'true' : 'false'}
                onClick={() => select(o.code)}
              >
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{o.code}</div>
                  <div className="text-xs text-gray-600 truncate">{o.label}</div>
                </div>
                {selected && <Check size={18} className="text-[rgb(var(--velore-accent))]" aria-hidden="true" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

