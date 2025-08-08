
import React from 'react'

export function Settings({ fontSize, setFontSize, lineHeight, setLineHeight, showHints, setShowHints }) {
  return (
    <div className="settings">
      <h2>Accessibility & Preferences</h2>
      <div className="setting">
        <label>Font size</label>
        <input type="range" min="14" max="28" value={fontSize} onChange={e => setFontSize(Number(e.target.value))} />
        <span>{fontSize}px</span>
      </div>
      <div className="setting">
        <label>Line height</label>
        <input type="range" min="1.2" max="2" step="0.1" value={lineHeight} onChange={e => setLineHeight(Number(e.target.value))} />
        <span>{lineHeight}</span>
      </div>
      <div className="setting">
        <label>
          <input type="checkbox" checked={showHints} onChange={e => setShowHints(e.target.checked)} />
          Show grammar hints in lessons
        </label>
      </div>
      <div className="setting">
        <p>Tip: Use Focus mode (top-right) to hide distractions.</p>
      </div>
    </div>
  )
}
