import { useSelector } from 'react-redux'
import { formatCurrency, formatMinutes } from '../../utils/flowUtils'

const MetricCard = ({ icon, label, value, subValue, color, delay }) => (
  <div
    className="metric-card"
    style={{
      animation: `fadeInUp 0.5s ease ${delay}s forwards`,
      opacity: 0,
      borderLeft: `3px solid ${color}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <div style={{ fontSize: '20px', marginBottom: '6px' }}>{icon}</div>
        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          {label}
        </div>
        <div style={{ fontSize: '22px', fontWeight: 800, color, fontFamily: "'Space Grotesk', sans-serif" }}>
          {value}
        </div>
        {subValue && (
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {subValue}
          </div>
        )}
      </div>
    </div>
  </div>
)

const ConfidenceBar = ({ value }) => {
  const pct = Math.round(value * 100)
  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#f43f5e'
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Automation Confidence
        </span>
        <span style={{ fontSize: '13px', fontWeight: 700, color }}>{pct}%</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}88, ${color})`,
          borderRadius: '3px',
          transition: 'width 1s ease',
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  )
}

export default function ROIMetrics() {
  const { roi, tags, workflowName, nodes } = useSelector(s => s.workflow)

  if (!roi) return null

  const approvalCount = nodes.filter(n => n.requires_human_approval).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {/* Section header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '6px', height: '6px', borderRadius: '50%',
          background: '#10b981', boxShadow: '0 0 8px #10b981',
          animation: 'pulse-green 2s ease-in-out infinite',
        }} />
        <h3 style={{
          fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          ROI Impact Analysis
        </h3>
      </div>

      {/* Metrics grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <MetricCard
          icon="⏱️" label="Manual Time" color="#06b6d4"
          value={formatMinutes(roi.estimated_manual_minutes)}
          subValue="per execution" delay={0.05}
        />
        <MetricCard
          icon="📅" label="Hours Saved" color="#10b981"
          value={`${roi.hours_saved_per_week}h`}
          subValue="per week" delay={0.1}
        />
        <MetricCard
          icon="📈" label="Annual Hours" color="#a78bfa"
          value={`${roi.annual_hours_saved}h`}
          subValue="recovered/year" delay={0.15}
        />
        <MetricCard
          icon="💰" label="Cost Savings" color="#f59e0b"
          value={formatCurrency(roi.estimated_annual_cost_savings)}
          subValue="annually @ $50/hr" delay={0.2}
        />
      </div>

      {/* Confidence bar */}
      <div className="metric-card" style={{ padding: '14px' }}>
        <ConfidenceBar value={roi.automation_confidence} />
      </div>

      {/* Complexity + guardrails */}
      <div style={{
        display: 'flex', gap: '10px',
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Complexity
          </div>
          <div style={{ display: 'flex', gap: '3px' }}>
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} style={{
                flex: 1, height: '4px', borderRadius: '2px',
                background: i < roi.complexity_score
                  ? roi.complexity_score <= 4 ? '#10b981'
                    : roi.complexity_score <= 7 ? '#f59e0b' : '#f43f5e'
                  : 'rgba(255,255,255,0.06)',
              }} />
            ))}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '3px' }}>
            {roi.complexity_score}/10
          </div>
        </div>
        <div style={{ width: '1px', background: 'var(--color-border)' }} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Guardrails
          </div>
          <div style={{ fontSize: '18px', fontWeight: 800, color: '#f59e0b', fontFamily: "'Space Grotesk', sans-serif" }}>
            {approvalCount}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--color-text-muted)' }}>approval gates</div>
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {tags.map(tag => (
            <span key={tag} className="tag">#{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}
