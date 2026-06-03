import { createSlice } from '@reduxjs/toolkit'

/**
 * Simulation status machine:
 * idle → running → paused_approval → running → complete
 */
const initialState = {
  // Current workflow being displayed
  workflowId: null,
  workflowName: '',
  workflowDescription: '',
  tags: [],

  // React Flow data
  nodes: [],      // Raw parsed nodes from LLM
  edges: [],      // Raw parsed edges from LLM
  flowNodes: [],  // Transformed for React Flow
  flowEdges: [],  // Transformed for React Flow

  // ROI data
  roi: null,

  // UI state
  isLoading: false,
  error: null,
  rawInput: '',

  // Simulation
  simulationStatus: 'idle',   // idle | running | paused_approval | complete
  activeNodeId: null,
  approvedNodes: [],
  simulationLog: [],

  // Saved agents list
  savedWorkflows: [],
  savedLoading: false,

  // Node approval toggles (nodeId -> bool)
  nodeApprovals: {},
}

const workflowSlice = createSlice({
  name: 'workflow',
  initialState,
  reducers: {
    setRawInput(state, action) {
      state.rawInput = action.payload
    },
    setLoading(state, action) {
      state.isLoading = action.payload
      if (action.payload) state.error = null
    },
    setError(state, action) {
      state.error = action.payload
      state.isLoading = false
    },
    setWorkflow(state, action) {
      const { workflowId, parsed, flowNodes, flowEdges } = action.payload
      state.workflowId = workflowId
      state.workflowName = parsed.workflow_name
      state.workflowDescription = parsed.description
      state.tags = parsed.tags || []
      state.nodes = parsed.nodes
      state.edges = parsed.edges
      state.flowNodes = flowNodes
      state.flowEdges = flowEdges
      state.roi = parsed.roi
      state.isLoading = false
      state.error = null
      state.simulationStatus = 'idle'
      state.activeNodeId = null
      state.approvedNodes = []
      state.simulationLog = []
      state.nodeApprovals = {}
    },
    updateFlowNodes(state, action) {
      state.flowNodes = action.payload
    },
    updateFlowEdges(state, action) {
      state.flowEdges = action.payload
    },

    // Simulation
    startSimulation(state) {
      state.simulationStatus = 'running'
      state.activeNodeId = null
      state.approvedNodes = []
      state.simulationLog = ['🚀 Simulation started...']
      // Reset node states
      state.flowNodes = state.flowNodes.map(n => ({
        ...n,
        data: { ...n.data, simState: 'idle' },
      }))
    },
    setActiveNode(state, action) {
      const id = action.payload
      state.activeNodeId = id
      state.flowNodes = state.flowNodes.map(n => ({
        ...n,
        data: {
          ...n.data,
          simState: n.id === id ? 'active'
            : state.approvedNodes.includes(n.id) ? 'approved'
            : 'idle',
        },
      }))
    },
    pauseForApproval(state, action) {
      state.simulationStatus = 'paused_approval'
      state.activeNodeId = action.payload
      state.flowNodes = state.flowNodes.map(n => ({
        ...n,
        data: {
          ...n.data,
          simState: n.id === action.payload ? 'pending' : n.data.simState,
        },
      }))
      state.simulationLog = [
        ...state.simulationLog,
        `⏸ Paused — Human approval required for: "${
          state.nodes.find(n => n.id === action.payload)?.label
        }"`,
      ]
    },
    approveNode(state, action) {
      const id = action.payload
      state.approvedNodes = [...state.approvedNodes, id]
      state.simulationStatus = 'running'
      state.flowNodes = state.flowNodes.map(n => ({
        ...n,
        data: {
          ...n.data,
          simState: n.id === id ? 'approved' : n.data.simState,
        },
      }))
      state.simulationLog = [
        ...state.simulationLog,
        `✅ Approved: "${state.nodes.find(n => n.id === id)?.label}"`,
      ]
    },
    addSimLog(state, action) {
      state.simulationLog = [...state.simulationLog, action.payload]
    },
    completeSimulation(state) {
      state.simulationStatus = 'complete'
      state.activeNodeId = null
      state.simulationLog = [...state.simulationLog, '🎉 Simulation complete! All steps executed successfully.']
    },
    resetSimulation(state) {
      state.simulationStatus = 'idle'
      state.activeNodeId = null
      state.approvedNodes = []
      state.simulationLog = []
      state.flowNodes = state.flowNodes.map(n => ({
        ...n,
        data: { ...n.data, simState: 'idle' },
      }))
    },

    // Node approval toggles
    toggleNodeApproval(state, action) {
      const id = action.payload
      state.nodeApprovals[id] = !state.nodeApprovals[id]
    },

    // Saved workflows
    setSavedLoading(state, action) {
      state.savedLoading = action.payload
    },
    setSavedWorkflows(state, action) {
      state.savedWorkflows = action.payload
      state.savedLoading = false
    },
    removeSavedWorkflow(state, action) {
      state.savedWorkflows = state.savedWorkflows.filter(w => w.id !== action.payload)
    },
    clearWorkflow(state) {
      return { ...initialState, savedWorkflows: state.savedWorkflows }
    },
  },
})

export const {
  setRawInput, setLoading, setError, setWorkflow,
  updateFlowNodes, updateFlowEdges,
  startSimulation, setActiveNode, pauseForApproval, approveNode,
  addSimLog, completeSimulation, resetSimulation,
  toggleNodeApproval,
  setSavedLoading, setSavedWorkflows, removeSavedWorkflow, clearWorkflow,
} = workflowSlice.actions

export default workflowSlice.reducer
