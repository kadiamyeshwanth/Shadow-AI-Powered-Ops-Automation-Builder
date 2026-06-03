import { memo } from 'react'
import { Handle, Position } from '@xyflow/react'
import { useDispatch } from 'react-redux'
import { approveNode } from '../../store/workflowSlice'
import { getNodeColor, getSimStateStyle, ACTION_TYPE_ICONS } from '../../utils/flowUtils'

const TYPE_LABELS = {
  trigger: 'Trigger',
  condition: 'Condition',
  action: 'Action',
}

const ShadowNode = memo(({ data, id }) => {
  const dispatch = useDispatch()
  const { label, description, nodeType, actionType, requiresApproval, toolHint, simState } = data

  const baseColor = getNodeColor(nodeType)
  const simStyle = getSimStateStyle(simState, baseColor.border)

  const isPending  = simState === 'pending'
  const isApproved = simState === 'approved'
  const isActive   = simState === 'active'

  return (
    <div
      style={{
        background: simState !== 'idle'
          ? `linear-gradient(135deg, ${baseColor.bg}, rgba(0,0,0,0.3))`
          : baseColor.bg,
        border: `1.5px solid ${simStyle.border}`,
        boxShadow: simStyle.glow,
        borderRadius: '14px',
        padding: '14px 16px',
        width: '260px',
        minHeight: '100px',
        transition: 'all 0.35s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Shimmer overlay when active */}
      {isActive && (
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(6,182,212,0.08), transparent)',
          animation: 'shimmer 1.5s linear infinite',
          backgroundSize: '200% auto',
        }} />
      )}

      {/* Top row: icon + type badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>{ACTION_TYPE_ICONS[actionType] || '⚡'}</span>
          <span className={`badge badge-${nodeType}`}>{TYPE_LABELS[nodeType] || nodeType}</span>
        </div>

        {/* Sim state indicator */}
        {simState !== 'idle' && (
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: isApproved ? '#10b981' : isPending ? '#f59e0b' : '#06b6d4',
            boxShadow: `0 0 6px ${isApproved ? '#10b981' : isPending ? '#f59e0b' : '#06b6d4'}`,
            animation: isApproved ? 'none' : 'pulse-glow 1s ease-in-out infinite',
          }} />
        )}
      </div>

      {/* Label */}
      <div style={{
        color: '#f1f5f9',
        fontWeight: 600,
        fontSize: '13px',
        fontFamily: "'Space Grotesk', sans-serif",
        marginBottom: '4px',
        lineHeight: 1.4,
      }}>
        {label}
      </div>

      {/* Description */}
      {description && (
        <div style={{
          color: '#64748b',
          fontSize: '11px',
          lineHeight: 1.5,
          marginBottom: toolHint ? '6px' : 0,
        }}>
          {description}
        </div>
      )}

      {/* Tool hint pill */}
      {toolHint && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '4px',
          marginTop: '4px',
          padding: '2px 8px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '20px',
          fontSize: '10px',
          color: '#64748b',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          🔧 {toolHint}
        </div>
      )}

      {/* Approval required badge (static) */}
      {requiresApproval && simState === 'idle' && (
        <div style={{
          marginTop: '8px',
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '10px', color: '#f59e0b', fontWeight: 500,
        }}>
          <span>🛡️</span> Requires human approval
        </div>
      )}

      {/* Pending approval button */}
      {isPending && (
        <button
          onClick={() => dispatch(approveNode(id))}
          className="btn-success"
          style={{ marginTop: '10px', width: '100%', justifyContent: 'center', fontSize: '11px' }}
        >
          ✅ Approve Execution
        </button>
      )}

      {/* Approved state */}
      {isApproved && (
        <div style={{
          marginTop: '8px',
          display: 'flex', alignItems: 'center', gap: '5px',
          fontSize: '11px', color: '#10b981', fontWeight: 600,
        }}>
          ✅ Approved & Executed
        </div>
      )}

      {/* React Flow handles */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: simStyle.border, width: '10px', height: '10px', border: '2px solid #0d1120' }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: simStyle.border, width: '10px', height: '10px', border: '2px solid #0d1120' }}
      />
    </div>
  )
})

ShadowNode.displayName = 'ShadowNode'
export default ShadowNode
