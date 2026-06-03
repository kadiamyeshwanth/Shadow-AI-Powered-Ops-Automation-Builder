import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

/**
 * Parse a raw workflow description via the AI backend.
 * @param {string} rawInput
 * @returns {Promise<{workflow_id: string, parsed: object}>}
 */
export const parseWorkflow = async (rawInput) => {
  const { data } = await api.post('/workflow/parse', { raw_input: rawInput })
  return data
}

/**
 * Fetch all saved workflows (paginated via limit).
 */
export const fetchWorkflows = async (limit = 20) => {
  const { data } = await api.get(`/workflow/list?limit=${limit}`)
  return data
}

/**
 * Get a single workflow by ID.
 */
export const fetchWorkflowById = async (id) => {
  const { data } = await api.get(`/workflow/${id}`)
  return data
}

/**
 * Delete a workflow by ID.
 */
export const deleteWorkflow = async (id) => {
  const { data } = await api.delete(`/workflow/${id}`)
  return data
}
