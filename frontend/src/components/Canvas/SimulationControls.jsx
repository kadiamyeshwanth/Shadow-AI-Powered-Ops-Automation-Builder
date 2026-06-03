import { useSelector, useDispatch } from 'react-redux'
import { resetSimulation } from '../../store/workflowSlice'
import { useSimulationEngine } from './useSimulation'

const STATUS_CONFIG = {
  idle:             { label: 'Ready to Simulate',      color: '#94a3b8',  icon: '▶' },
  running:          { label: 'Pipeline Running...',     color: '#06b6d4',  icon: '⚡' },
  paused_approval:  { label: 'Awaiting Approval',       color: '#f59e0b',  icon: '⏸' },
  complete:         { label: 'Simulation Complete!',    color: '#10b981',  icon: '✅' },
}

export default function SimulationControls() {
  const dispatch = useDispatch()
  const { simulationStatus, simulationLog, nodes } = useSelector(s => s.workflow)
  const { runSimulation } = useSimulationEngine()

  const config = STATUS_CONFIG[simulationStatus] || STATUS_CONFIG.idle
  const isRunning = simulationStatus === 'running' || simulationStatus === 'paused_approval'
  const hasNodes = nodes.length > 0

  return (
    <div style={{
      background: 'rgba(13,17,32,0.9)',
      border: '1px solid var(--color-border)',
      borderRadius: '12px',
      padding: '14px 16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '16px',
      backdropFilter: 'blur(12px)',
    }}>
      {/* Left: buttons */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button
          className="btn-primary"
          onClick={runSimulation}
          disabled={!hasNodes || isRunning}
          style={{ padding: '9px 18px', fontSize: '13px' }}
        >
          {isRunning ? (
            <>
              <span style={{
                width: '12px', height: '12px', border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white', borderRadius: '50%',
                display: 'inline-block', animation: 'spin-slow 0.8s linear infinite',
              }} />
              Running
            </>
          ) : simulationStatus === 'complete' ? (
            <> 🔄 Re-run </>
          ) : (
            <> ▶ Run Simulation </>
          )}
        </button>

        {simulationStatus !== 'idle' && (
          <button
            className="btn-secondary"
            onClick={() => dispatch(resetSimulation())}
            style={{ padding: '9px 14px', fontSize: '13px' }}
          >
            ↺ Reset
          </button>
        )}
      </div>

      {/* Right: status + log */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
          <span style={{ fontSize: '14px' }}>{config.icon}</span>
          <span style={{ fontSize: '13px', fontWeight: 600, color: config.color }}>
            {config.label}
          </span>
        </div>

        {/* Execution log (last 3 entries) */}
        {simulationLog.length > 0 && (
          <div style={{
            display: 'flex', flexDirection: 'column', gap: '2px',
          }}>
            {simulationLog.slice(-3).map((entry, i) => (
              <div key={i} style={{
                fontSize: '11px',
                color: i === simulationLog.slice(-3).length - 1
                  ? 'var(--color-text-secondary)'
                  : 'var(--color-text-muted)',
                fontFamily: "'JetBrains Mono', monospace",
                opacity: i === 0 ? 0.5 : i === 1 ? 0.75 : 1,
                transition: 'opacity 0.3s',
              }}>
                {entry}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
