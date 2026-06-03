import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { clearWorkflow } from '../store/workflowSlice'
import WorkflowInput from '../components/InputPanel/WorkflowInput'
import ROIMetrics from '../components/InputPanel/ROIMetrics'
import WorkflowCanvas from '../components/Canvas/WorkflowCanvas'
import SavedAgents from '../components/Sidebar/SavedAgents'

export default function DashboardLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { workflowName, roi, simulationStatus } = useSelector(s => s.workflow)

  const simColor = simulationStatus === 'complete' ? '#10b981'
    : simulationStatus === 'running' ? '#06b6d4'
    : simulationStatus === 'paused_approval' ? '#f59e0b'
    : '#7c3aed'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      {/* ── TOP NAV ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 24px',
        height: '56px',
        borderBottom: '1px solid var(--color-border)',
        background: 'rgba(8,11,20,0.95)',
        backdropFilter: 'blur(16px)',
        flexShrink: 0,
        zIndex: 50,
      }}>
        {/* Logo */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          <div style={{
            width: '28px', height: '28px', borderRadius: '7px',
            background: 'linear-gradient(135deg, #7c3aed, #06b6d4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px',
          }}>🤖</div>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: '16px',
            background: 'linear-gradient(135deg, #a78bfa, #06b6d4)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Shadow</span>
        </div>

        {/* Center: active workflow pill */}
        {workflowName && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '5px 14px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--color-border)',
            borderRadius: '20px',
          }}>
            <div style={{
              width: '7px', height: '7px', borderRadius: '50%',
              background: simColor,
              boxShadow: `0 0 6px ${simColor}`,
              flexShrink: 0,
            }} />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {workflowName}
            </span>
            {roi && (
              <span style={{
                fontSize: '11px', color: '#10b981', fontWeight: 600,
                paddingLeft: '8px', borderLeft: '1px solid var(--color-border)',
              }}>
                ↑ {roi.hours_saved_per_week}h/wk
              </span>
            )}
          </div>
        )}

        {/* Right actions */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {workflowName && (
            <button
              className="btn-secondary"
              onClick={() => dispatch(clearWorkflow())}
              style={{ padding: '6px 14px', fontSize: '12px' }}
            >
              + New Workflow
            </button>
          )}
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #7c3aed, #4f46e5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '14px', cursor: 'pointer',
          }}>
            👤
          </div>
        </div>
      </header>

      {/* ── MAIN LAYOUT ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* LEFT PANEL — Input + ROI (fixed width) */}
        <aside style={{
          width: '340px',
          flexShrink: 0,
          borderRight: '1px solid var(--color-border)',
          background: 'rgba(8,11,20,0.98)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div className="panel-scroll" style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <WorkflowInput />
            <ROIMetrics />
          </div>
        </aside>

        {/* CENTER — Canvas (flexible) */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          overflow: 'hidden',
          background: 'var(--color-bg-primary)',
          minWidth: 0,
        }}>
          <WorkflowCanvas />
        </main>

        {/* RIGHT SIDEBAR — Saved Agents */}
        <aside style={{
          width: '300px',
          flexShrink: 0,
          borderLeft: '1px solid var(--color-border)',
          background: 'rgba(8,11,20,0.98)',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          overflow: 'hidden',
        }}>
          <SavedAgents />
        </aside>
      </div>
    </div>
  )
}
