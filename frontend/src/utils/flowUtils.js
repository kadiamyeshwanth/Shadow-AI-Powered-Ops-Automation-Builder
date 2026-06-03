import dagre from 'dagre'

const NODE_WIDTH = 260
const NODE_HEIGHT = 110

/**
 * Convert LLM-parsed workflow JSON → React Flow nodes + edges
 * Uses Dagre for automatic left-right layout.
 */
export const transformToFlow = (parsedData) => {
  const { nodes, edges } = parsedData

  // Build dagre graph for layout
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({ rankdir: 'TB', ranksep: 80, nodesep: 40 })

  nodes.forEach((node) => {
    g.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
  })
  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target)
  })

  dagre.layout(g)

  const flowNodes = nodes.map((node) => {
    const { x, y } = g.node(node.id)
    return {
      id: node.id,
      type: 'shadowNode',
      position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
      data: {
        label: node.label,
        description: node.description || '',
        nodeType: node.type,         // trigger | condition | action
        actionType: node.action_type,
        requiresApproval: node.requires_human_approval || false,
        toolHint: node.tool_hint || '',
        simState: 'idle',            // idle | active | pending | approved
      },
    }
  })

  const flowEdges = edges.map((edge, i) => ({
    id: `e-${edge.source}-${edge.target}-${i}`,
    source: edge.source,
    target: edge.target,
    animated: true,
    style: { stroke: '#4f46e5', strokeWidth: 2 },
    type: 'smoothstep',
  }))

  return { flowNodes, flowEdges }
}

/**
 * Format a number as currency (USD, abbreviated).
 */
export const formatCurrency = (amount) => {
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}k`
  }
  return `$${amount.toFixed(0)}`
}

/**
 * Format minutes into a readable string.
 */
export const formatMinutes = (minutes) => {
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h ${m}m` : `${h}h`
  }
  return `${minutes}m`
}

/**
 * Get node color class based on type.
 */
export const getNodeColor = (nodeType) => {
  switch (nodeType) {
    case 'trigger':   return { border: '#10b981', bg: 'rgba(16,185,129,0.08)',  text: '#10b981' }
    case 'condition': return { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', text: '#f59e0b' }
    case 'action':    return { border: '#7c3aed', bg: 'rgba(124,58,237,0.08)', text: '#a78bfa' }
    default:          return { border: '#475569', bg: 'rgba(71,85,105,0.08)',   text: '#94a3b8' }
  }
}

export const getSimStateStyle = (simState, baseColor) => {
  switch (simState) {
    case 'active':   return { border: '#06b6d4', glow: '0 0 20px rgba(6,182,212,0.5)' }
    case 'approved': return { border: '#10b981', glow: '0 0 20px rgba(16,185,129,0.5)' }
    case 'pending':  return { border: '#f59e0b', glow: '0 0 20px rgba(245,158,11,0.6)' }
    default:         return { border: baseColor,  glow: 'none' }
  }
}

export const ACTION_TYPE_ICONS = {
  fetch_data:        '📥',
  logical_filter:    '🔀',
  generate_text:     '✍️',
  send_notification: '📧',
  update_record:     '📝',
  schedule:          '⏰',
  transform_data:    '⚙️',
}
