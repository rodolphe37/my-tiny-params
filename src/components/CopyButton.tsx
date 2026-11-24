import { useState } from 'react'
import { useI18n } from '../i18n'

export function copyText(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text)
  const ta = document.createElement('textarea')
  ta.value = text
  document.body.appendChild(ta)
  ta.select()
  document.execCommand('copy')
  ta.remove()
  return Promise.resolve()
}

export function CopyButton({ text, label, className = '' }: { text: string; label?: string; className?: string }) {
  const { t } = useI18n()
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      className={`btn ${done ? 'btn-ok' : 'btn-primary'} ${className}`}
      onClick={async () => {
        await copyText(text)
        setDone(true)
        setTimeout(() => setDone(false), 1600)
      }}
    >
      {done ? t('common.copied') : (label ?? t('common.copy'))}
    </button>
  )
}
