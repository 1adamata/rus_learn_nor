
import React from 'react'

export function FocusToggle({ value, onChange }) {
  return (
    <label className="focus-toggle">
      <input type="checkbox" checked={value} onChange={e => onChange(e.target.checked)} />
      <span>Focus mode</span>
    </label>
  )
}
