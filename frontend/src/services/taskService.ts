const BASE_URL = 'http://localhost:8080/api/v1'

export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateTaskRequest {
  title: string
  description?: string | null
  completed?: boolean
}

export interface TaskResponse {
  success: boolean
  data?: Task | Task[]
  error?: string
  message?: string
}

export interface TaskFilterOptions {
  title?: string
  completed?: boolean
  limit?: number
  offset?: number
}

const getAuthHeaders = (token: string | null) => {
  if (!token) {
    throw new Error('Authentication token is missing')
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const error = await response.json()
    return error.message || error.error || `HTTP ${response.status}`
  } catch {
    return `HTTP ${response.status}: ${response.statusText}`
  }
}

export const taskService = {
  async getTasks(token: string | null): Promise<Task[]> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      })

      if (!response.ok) {
        const errorMessage = await parseErrorMessage(response)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        return data as Task[]
      }

      if (data.data && Array.isArray(data.data)) {
        return data.data as Task[]
      }

      throw new Error('Invalid response format from getTasks')
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch tasks')
    }
  },

  async getTask(id: number, token: string | null): Promise<Task> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      if (!id || id <= 0) {
        throw new Error('Invalid task ID')
      }

      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      })

      if (!response.ok) {
        const errorMessage = await parseErrorMessage(response)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.data) {
        return data.data as Task
      }

      return data as Task
    } catch (error) {
      throw error instanceof Error ? error : new Error(`Failed to fetch task ${id}`)
    }
  },

  async createTask(
    task: CreateTaskRequest,
    token: string | null
  ): Promise<Task> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      if (!task.title || task.title.trim().length === 0) {
        throw new Error('Task title is required')
      }

      if (task.title.length > 200) {
        throw new Error('Task title must be 200 characters or less')
      }

      if (task.description && task.description.length > 1000) {
        throw new Error('Task description must be 1000 characters or less')
      }

      const payload: CreateTaskRequest = {
        title: task.title.trim(),
        description: task.description?.trim() || null,
        completed: task.completed ?? false,
      }

      const response = await fetch(`${BASE_URL}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorMessage = await parseErrorMessage(response)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.data) {
        return data.data as Task
      }

      return data as Task
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to create task')
    }
  },

  async updateTask(
    id: number,
    task: CreateTaskRequest,
    token: string | null
  ): Promise<Task> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      if (!id || id <= 0) {
        throw new Error('Invalid task ID')
      }

      if (!task.title || task.title.trim().length === 0) {
        throw new Error('Task title is required')
      }

      if (task.title.length > 200) {
        throw new Error('Task title must be 200 characters or less')
      }

      if (task.description && task.description.length > 1000) {
        throw new Error('Task description must be 1000 characters or less')
      }

      const payload: CreateTaskRequest = {
        title: task.title.trim(),
        description: task.description?.trim() || null,
        completed: task.completed ?? false,
      }

      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorMessage = await parseErrorMessage(response)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (data.data) {
        return data.data as Task
      }

      return data as Task
    } catch (error) {
      throw error instanceof Error ? error : new Error(`Failed to update task ${id}`)
    }
  },

  async deleteTask(id: number, token: string | null): Promise<void> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      if (!id || id <= 0) {
        throw new Error('Invalid task ID')
      }

      const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token),
      })

      if (!response.ok) {
        const errorMessage = await parseErrorMessage(response)
        throw new Error(errorMessage)
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error(`Failed to delete task ${id}`)
    }
  },

  async getAllTasks(token: string | null): Promise<Task[]> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      const response = await fetch(`${BASE_URL}/admin/tasks`, {
        method: 'GET',
        headers: getAuthHeaders(token),
      })

      if (response.status === 403) {
        throw new Error('Access Denied: Only ADMIN users can view all tasks')
      }

      if (!response.ok) {
        const errorMessage = await parseErrorMessage(response)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        return data as Task[]
      }

      if (data.data && Array.isArray(data.data)) {
        return data.data as Task[]
      }

      throw new Error('Invalid response format from getAllTasks')
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to fetch all tasks')
    }
  },

  async searchTasks(
    token: string | null,
    filters?: TaskFilterOptions
  ): Promise<Task[]> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      const params = new URLSearchParams()

      if (filters?.title) {
        params.append('title', filters.title.trim())
      }

      if (filters?.completed !== undefined) {
        params.append('completed', String(filters.completed))
      }

      if (filters?.limit && filters.limit > 0) {
        params.append('limit', String(filters.limit))
      }

      if (filters?.offset !== undefined && filters.offset >= 0) {
        params.append('offset', String(filters.offset))
      }

      const queryString = params.toString()
      const url = queryString ? `${BASE_URL}/tasks/search?${queryString}` : `${BASE_URL}/tasks`

      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(token),
      })

      if (!response.ok) {
        const errorMessage = await parseErrorMessage(response)
        throw new Error(errorMessage)
      }

      const data = await response.json()

      if (Array.isArray(data)) {
        return data as Task[]
      }

      if (data.data && Array.isArray(data.data)) {
        return data.data as Task[]
      }

      throw new Error('Invalid response format from searchTasks')
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to search tasks')
    }
  },

  async bulkUpdateTasks(
    ids: number[],
    completed: boolean,
    token: string | null
  ): Promise<Task[]> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      if (!ids || ids.length === 0) {
        throw new Error('No tasks selected for bulk update')
      }

      if (ids.some(id => !id || id <= 0)) {
        throw new Error('Invalid task ID in selection')
      }

      const results: Task[] = []
      const errors: { id: number; error: string }[] = []

      for (const id of ids) {
        try {
          const task = await this.updateTask(
            id,
            { title: '', completed },
            token
          )
          results.push(task)
        } catch (error) {
          errors.push({
            id,
            error: error instanceof Error ? error.message : 'Unknown error',
          })
        }
      }

      return results
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to bulk update tasks')
    }
  },

  async getTaskStats(token: string | null): Promise<{
    total: number
    completed: number
    pending: number
  }> {
    try {
      if (!token) {
        throw new Error('No authentication token found')
      }

      const tasks = await this.getTasks(token)

      const stats = {
        total: tasks.length,
        completed: tasks.filter(t => t.completed).length,
        pending: tasks.filter(t => !t.completed).length,
      }

      return stats
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to get task statistics')
    }
  },

  async verifyTaskOwnership(taskId: number, token: string | null): Promise<boolean> {
    try {
      if (!token) return false

      await this.getTask(taskId, token)
      return true
    } catch {
      return false
    }
  },
}
