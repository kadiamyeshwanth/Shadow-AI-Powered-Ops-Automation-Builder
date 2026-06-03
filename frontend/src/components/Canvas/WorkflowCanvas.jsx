import { useCallback, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  ReactFlow, Background, Controls, MiniMap,
  useNodesState, useEdgesState, addEdge,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import ShadowNode from './CustomNode'
import SimulationControls from './SimulationControls'
import { updateFlowNodes, updateFlowEdges } from '../../store/workflowSlice'

const nodeTypes = { shadowNode: ShadowNode }

const EmptyState = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '100%', gap: '16px',
    color: 'var(--color-text-muted)',
  }}>
    <div style={{
      width: '80px', height: '80px', borderRadius: '50%',
      background: 'rgba(124,58,237,0.08)',
      border: '1px solid rgba(124,58,237,0.15)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: '32px', animation: 'float 3s ease-in-out infinite',
    }}>
      🤖
    </div>
    <div style={{ textAlign: 'center' }}>
      <p style={{ fontSize: '16px', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '6px' }}>
        Workflow Canvas
      </p>
      <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', maxWidth: '280px', lineHeight: 1.6 }}>
        Describe your manual process and Shadow will visualize it as an intelligent workflow graph
      </p>
    </div>
    <div style={{ display: 'flex', gap: '20px', marginTop: '8px' }}>
      {['Trigger', 'Condition', 'Action'].map((t, i) => (
        <div key={t} style={{
          display: 'flex', alignItems: 'center', gap: '6px',
          fontSize: '12px', color: 'var(--color-text-muted)',
        }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: ['#10b981', '#f59e0b', '#7c3aed'][i],
          }} />
          {t}
        </div>
      ))}
    </div>
  </div>
)

export default function WorkflowCanvas() {
  const dispatch = useDispatch()
  const { flowNodes: storeNodes, flowEdges: storeEdges, workflowName, simulationStatus } = useSelector(s => s.workflow)

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges)

  // Sync store → local when workflow changes
  useMemo(() => {
    setNodes(storeNodes)
  }, [storeNodes]) // eslint-disable-line

  useMemo(() => {
    setEdges(storeEdges)
  }, [storeEdges]) // eslint-disable-line

  const onConnect = useCallback((params) => {
    setEdges(eds => addEdge({ ...params, animated: true, style: { stroke: '#4f46e5', strokeWidth: 2 } }, eds))
  }, [setEdges])

  const hasWorkflow = storeNodes.length > 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '12px' }}>
      {/* Canvas header */}
      {hasWorkflow && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 16px',
          background: 'rgba(17,24,39,0.8)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: simulationStatus === 'complete' ? '#10b981'
                : simulationStatus === 'running' ? '#06b6d4'
                : simulationStatus === 'paused_approval' ? '#f59e0b'
                : '#7c3aed',
              boxShadow: simulationStatus !== 'idle' ? '0 0 8px currentColor' : 'none',
            }} />
            <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: '14px' }}>
              {workflowName}
            </span>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
            {nodes.length} nodes · {edges.length} connections
          </div>
        </div>
      )}

      {/* Simulation controls */}
      {hasWorkflow && <SimulationControls />}

      {/* React Flow canvas */}
      <div style={{
        flex: 1,
        background: 'var(--color-bg-secondary)',
        border: '1px solid var(--color-border)',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: 0,
      }}>
        {hasWorkflow ? (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.3 }}
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#1e293b" gap={24} size={1} />
            <Controls position="bottom-right" />
            <MiniMap
              nodeColor={(n) => {
                const t = n.data?.nodeType
                return t === 'trigger' ? '#10b981' : t === 'condition' ? '#f59e0b' : '#7c3aed'
              }}
              style={{ background: '#0d1120', border: '1px solid var(--color-border)' }}
            />
          </ReactFlow>
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  )
}
