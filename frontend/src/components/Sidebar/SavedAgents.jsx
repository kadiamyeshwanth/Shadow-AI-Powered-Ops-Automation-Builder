import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setSavedLoading, setSavedWorkflows, removeSavedWorkflow, setWorkflow, clearWorkflow } from '../../store/workflowSlice'
import { fetchWorkflows, deleteWorkflow } from '../../api/workflowApi'
import { transformToFlow } from '../../utils/flowUtils'

const WorkflowCard = ({ workflow, onLoad, onDelete }) => {
  const roi = workflow.parsed?.roi
  const nodeCount = workflow.parsed?.nodes?.length || 0
  const date = new Date(workflow.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })

  return (
    <div
      className="glass-card glass-card-hover"
      style={{ padding: '14px', borderRadius: '12px', cursor: 'pointer' }}
      onClick={onLoad}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)',
            marginBottom: '4px', fontFamily: "'Space Grotesk', sans-serif",
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {workflow.parsed?.workflow_name || 'Unnamed Workflow'}
          </div>
          <div style={{
            fontSize: '11px', color: 'var(--color-text-muted)', lineHeight: 1.4,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {workflow.parsed?.description}
          </div>
        </div>
        <button
          className="btn-danger"
          onClick={(e) => { e.stopPropagation(); onDelete() }}
          style={{ flexShrink: 0, padding: '4px 8px', fontSize: '11px' }}
        >
          🗑
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--color-border)' }}>
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
          ⬡ {nodeCount} nodes
        </span>
        {roi && (
          <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 600 }}>
            ⏱ {roi.hours_saved_per_week}h/wk saved
          </span>
        )}
        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>
          {date}
        </span>
      </div>
    </div>
  )
}

export default function SavedAgents() {
  const dispatch = useDispatch()
  const { savedWorkflows, savedLoading } = useSelector(s => s.workflow)

  const load = async () => {
    dispatch(setSavedLoading(true))
    try {
      const data = await fetchWorkflows()
      dispatch(setSavedWorkflows(data.workflows || []))
    } catch {
      dispatch(setSavedLoading(false))
    }
  }

  useEffect(() => { load() }, [])

  const handleLoad = (wf) => {
    const { flowNodes, flowEdges } = transformToFlow(wf.parsed)
    dispatch(setWorkflow({
      workflowId: wf.id,
      parsed: wf.parsed,
      flowNodes,
      flowEdges,
    }))
  }

  const handleDelete = async (id) => {
    try {
      await deleteWorkflow(id)
      dispatch(removeSavedWorkflow(id))
    } catch (e) {
      console.error('Delete failed', e)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{
          fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)',
          textTransform: 'uppercase', letterSpacing: '0.06em',
          fontFamily: "'Space Grotesk', sans-serif",
        }}>
          🤖 Saved Agents
          {savedWorkflows.length > 0 && (
            <span style={{
              marginLeft: '8px', padding: '2px 7px',
              background: 'rgba(124,58,237,0.2)', color: '#a78bfa',
              borderRadius: '10px', fontSize: '11px', fontWeight: 600,
            }}>
              {savedWorkflows.length}
            </span>
          )}
        </h3>
        <button
          onClick={load}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--color-text-muted)', fontSize: '14px', padding: '4px',
            transition: 'color 0.2s',
          }}
          title="Refresh"
          onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
        >
          ↻
        </button>
      </div>

      {/* List */}
      <div className="panel-scroll" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {savedLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '24px', color: 'var(--color-text-muted)', fontSize: '13px' }}>
            <span style={{
              width: '16px', height: '16px', border: '2px solid rgba(124,58,237,0.3)',
              borderTopColor: '#7c3aed', borderRadius: '50%',
              display: 'inline-block', animation: 'spin-slow 0.8s linear infinite', marginRight: '8px',
            }} />
            Loading agents...
          </div>
        ) : savedWorkflows.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            padding: '32px 16px', color: 'var(--color-text-muted)', textAlign: 'center', gap: '8px',
          }}>
            <span style={{ fontSize: '28px' }}>📭</span>
            <p style={{ fontSize: '12px', lineHeight: 1.5 }}>
              No saved agents yet. Parse a workflow to get started.
            </p>
          </div>
        ) : (
          savedWorkflows.map(wf => (
            <WorkflowCard
              key={wf.id}
              workflow={wf}
              onLoad={() => handleLoad(wf)}
              onDelete={() => handleDelete(wf.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
