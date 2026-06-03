import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setRawInput, setLoading, setError, setWorkflow } from '../../store/workflowSlice'
import { parseWorkflow } from '../../api/workflowApi'
import { transformToFlow } from '../../utils/flowUtils'

const EXAMPLE_PROMPTS = [
  "Every Friday at 5pm, I download a CSV of all open invoices from QuickBooks. I check each row - if the amount is over $50,000 and it's more than 30 days overdue, I draft a formal payment reminder email and send it to the client's finance contact. Then I update our CRM to mark the invoice as 'escalated'.",
  "When a new lead fills out our website contact form, I manually copy their details into Salesforce, then send them a welcome email with our product deck attached. If they're from an enterprise company (500+ employees), I also notify the sales team on Slack.",
  "Every Monday morning, I pull last week's support ticket data, check if our response time exceeded 24 hours on any tickets, flag those to the customer success manager, and update the weekly KPI dashboard in Google Sheets.",
]

export default function WorkflowInput() {
  const dispatch = useDispatch()
  const { rawInput, isLoading, error } = useSelector(s => s.workflow)
  const [charCount, setCharCount] = useState(0)
  const textareaRef = useRef()

  const handleInput = (e) => {
    dispatch(setRawInput(e.target.value))
    setCharCount(e.target.value.length)
  }

  const handleParse = async () => {
    if (!rawInput.trim() || rawInput.trim().length < 20) {
      dispatch(setError('Please describe your workflow in more detail (at least 20 characters).'))
      return
    }
    dispatch(setLoading(true))
    try {
      const result = await parseWorkflow(rawInput)
      const { flowNodes, flowEdges } = transformToFlow(result.parsed)
      dispatch(setWorkflow({
        workflowId: result.workflow_id,
        parsed: result.parsed,
        flowNodes,
        flowEdges,
      }))
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Failed to parse workflow.'
      dispatch(setError(msg))
    }
  }

  const useExample = (text) => {
    dispatch(setRawInput(text))
    setCharCount(text.length)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleParse()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Header */}
      <div>
        <h2 style={{
          fontSize: '15px', fontWeight: 700, color: 'var(--color-text-primary)',
          marginBottom: '4px', fontFamily: "'Space Grotesk', sans-serif",
        }}>
          Describe Your Workflow
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
          Type any messy, conversational description of a manual process. Shadow's AI will parse and visualize it.
        </p>
      </div>

      {/* Textarea */}
      <div style={{ position: 'relative' }}>
        <textarea
          ref={textareaRef}
          className="input-field"
          rows={8}
          value={rawInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="e.g. Every Monday I download an Excel file of new signups, check if they're from enterprise accounts, and send a personalized onboarding email..."
          style={{ lineHeight: 1.7, fontSize: '13px' }}
        />
        <div style={{
          position: 'absolute', bottom: '10px', right: '12px',
          fontSize: '10px', color: 'var(--color-text-muted)',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          {charCount} chars · Ctrl+Enter to parse
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="toast-error" style={{
          position: 'static', padding: '10px 14px',
          borderRadius: '10px', fontSize: '12px', animation: 'fadeInUp 0.3s ease',
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Parse button */}
      <button
        className="btn-primary"
        onClick={handleParse}
        disabled={isLoading || !rawInput.trim()}
        style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
      >
        {isLoading ? (
          <>
            <span style={{
              width: '14px', height: '14px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: 'white',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin-slow 0.8s linear infinite',
            }} />
            Parsing with Gemini AI...
          </>
        ) : (
          <> ⚡ Parse Workflow </>
        )}
      </button>

      {/* Example prompts */}
      <div>
        <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: '8px', fontWeight: 500 }}>
          TRY AN EXAMPLE:
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {EXAMPLE_PROMPTS.map((ex, i) => (
            <button
              key={i}
              onClick={() => useExample(ex)}
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid var(--color-border)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'var(--color-text-muted)',
                fontSize: '11px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                lineHeight: 1.5,
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(124,58,237,0.4)'
                e.currentTarget.style.color = 'var(--color-text-secondary)'
                e.currentTarget.style.background = 'rgba(124,58,237,0.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border)'
                e.currentTarget.style.color = 'var(--color-text-muted)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
              }}
            >
              {['💰', '🎯', '📊'][i]} {ex.slice(0, 80)}...
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
