import { useDispatch, useSelector } from 'react-redux'
import {
  startSimulation, setActiveNode, pauseForApproval,
  completeSimulation, resetSimulation, addSimLog,
} from '../../store/workflowSlice'

const STEP_DELAY = 1400 // ms per node

export const useSimulationEngine = () => {
  const dispatch = useDispatch()
  const { nodes, flowNodes, simulationStatus } = useSelector(s => s.workflow)

  const runSimulation = async () => {
    if (simulationStatus !== 'idle' && simulationStatus !== 'complete') return

    dispatch(startSimulation())
    dispatch(addSimLog('⚙️ Initializing pipeline...'))

    const orderedNodes = nodes // already ordered from LLM

    for (let i = 0; i < orderedNodes.length; i++) {
      const node = orderedNodes[i]

      await new Promise(r => setTimeout(r, STEP_DELAY))
      dispatch(setActiveNode(node.id))
      dispatch(addSimLog(`▶ Processing: "${node.label}" [${node.type}]`))

      if (node.requires_human_approval) {
        dispatch(pauseForApproval(node.id))

        // Wait for approval (poll Redux state via a promise)
        await waitForApproval(node.id)
        dispatch(addSimLog(`↳ Resumed after approval`))
        await new Promise(r => setTimeout(r, 600))
      } else {
        await new Promise(r => setTimeout(r, 700))
        dispatch(addSimLog(`✓ Auto-executed: "${node.label}"`))
      }
    }

    await new Promise(r => setTimeout(r, 600))
    dispatch(completeSimulation())
  }

  return { runSimulation, simulationStatus }
}

// Returns a promise that resolves when the specific node is approved
function waitForApproval(nodeId) {
  return new Promise((resolve) => {
    const { store } = window.__shadowStore || {}
    if (!store) { resolve(); return }

    const check = () => {
      const state = store.getState().workflow
      if (
        state.approvedNodes.includes(nodeId) ||
        state.simulationStatus === 'idle'
      ) {
        resolve()
      } else {
        setTimeout(check, 200)
      }
    }
    check()
  })
}
