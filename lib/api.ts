import { API_BASE_URL } from "./env"

export interface Cliente {
  id: number
  nomeCliente: string
}

export interface Projeto {
  id: number
  nomeProjeto: string
  idCliente: number
}

export interface Tarefa {
  id: number
  nomeTask: string
  descricaoTask: string
  idProjeto: number
  tagTask: string
  dataInicio: string
  dataFim: string
  isAtivo: boolean
}

// Cliente API functions
export const clienteApi = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await fetch(`${API_BASE_URL}/clientes`)
    if (!response.ok) throw new Error("Failed to fetch clientes")
    return response.json()
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`)
    if (!response.ok) throw new Error("Failed to fetch cliente")
    return response.json()
  },

  create: async (cliente: Omit<Cliente, "id">): Promise<Cliente> => {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    })
    if (!response.ok) throw new Error("Failed to create cliente")
    return response.json()
  },

  update: async (id: number, cliente: Omit<Cliente, "id">): Promise<Cliente> => {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    })
    if (!response.ok) throw new Error("Failed to update cliente")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete cliente")
  },
}

// Projeto API functions
export const projetoApi = {
  getAll: async (): Promise<Projeto[]> => {
    const response = await fetch(`${API_BASE_URL}/projetos`)
    if (!response.ok) throw new Error("Failed to fetch projetos")
    return response.json()
  },

  getByCliente: async (clienteId: number): Promise<Projeto[]> => {
    const response = await fetch(`${API_BASE_URL}/projetos/cliente/${clienteId}`)
    if (!response.ok) throw new Error("Failed to fetch projetos by cliente")
    return response.json()
  },

  getById: async (id: number): Promise<Projeto> => {
    const response = await fetch(`${API_BASE_URL}/projetos/${id}`)
    if (!response.ok) throw new Error("Failed to fetch projeto")
    return response.json()
  },

  create: async (projeto: Omit<Projeto, "id">): Promise<Projeto> => {
    const response = await fetch(`${API_BASE_URL}/projetos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projeto),
    })
    if (!response.ok) throw new Error("Failed to create projeto")
    return response.json()
  },

  update: async (id: number, projeto: Omit<Projeto, "id">): Promise<Projeto> => {
    const response = await fetch(`${API_BASE_URL}/projetos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projeto),
    })
    if (!response.ok) throw new Error("Failed to update projeto")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/projetos/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete projeto")
  },
}

// Tarefa API functions
export const tarefaApi = {
  getAll: async (): Promise<Tarefa[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks`)
    if (!response.ok) throw new Error("Failed to fetch tasks")
    return response.json()
  },

  getByProjeto: async (projetoId: number): Promise<Tarefa[]> => {
    const response = await fetch(`${API_BASE_URL}/tasks/projeto/${projetoId}`)
    if (!response.ok) throw new Error("Failed to fetch tasks by projeto")
    return response.json()
  },

  getById: async (id: number): Promise<Tarefa> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`)
    if (!response.ok) throw new Error("Failed to fetch task")
    return response.json()
  },

  getByTag: async (tagTask: string): Promise<Tarefa> => {
    const response = await fetch(`${API_BASE_URL}/tasks/tag/${tagTask}`)
    if (!response.ok) throw new Error("Failed to fetch task by tag")
    return response.json()
  },

  create: async (tarefa: Omit<Tarefa, "id">): Promise<Tarefa> => {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa),
    })
    if (!response.ok) throw new Error("Failed to create task")
    return response.json()
  },

  update: async (id: number, tarefa: Omit<Tarefa, "id">): Promise<Tarefa> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tarefa),
    })
    if (!response.ok) throw new Error("Failed to update task")
    return response.json()
  },

  delete: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete task")
  },
}

// Report interfaces and API functions
export interface CollaboratorReport {
  collaboratorEmail: string
  totalHoursWorked: number
  hoursPerProject: Array<{
    projectId: number
    projectName: string
    hours: number
    clientName: string
  }>
  hoursPerTask: Array<{
    taskId: number
    taskName: string
    hours: number
    projectId: number
    projectName: string
  }>
  productivityAnalysis: {
    hoursByDayOfWeek: Record<string, number>
    hoursByMonth: Record<string, number>
    trendData: Array<{
      date: string
      hours: number
    }>
    peakPeriods: Array<{
      startDate: string
      endDate: string
      hours: number
    }>
    lowPeriods: Array<{
      startDate: string
      endDate: string
      hours: number
    }>
  }
  contextDetails: {
    hoursByTimePeriod: {
      MORNING: number
      AFTERNOON: number
      EVENING: number
    }
    averageSessionDurationMinutes: number
  }
}

export interface ClientReport {
  clientId: number
  clientName: string
  projects: Array<{
    projectId: number
    projectName: string
    totalHours: number
    collaboratorHours: Array<{
      collaboratorEmail: string
      hours: number
    }>
    tasks: Array<{
      taskId: number
      taskName: string
      totalHours: number
      collaboratorHours: Array<{
        collaboratorEmail: string
        hours: number
      }>
    }>
  }>
}

export type PeriodType = "WEEK" | "MONTH" | "QUARTER" | "YEAR"

// Report API functions
export const reportApi = {
  // Get report for a specific collaborator
  getCollaboratorReport: async (
    email: string,
    options?: {
      startDate?: string
      endDate?: string
      periodType?: PeriodType
      projectIds?: number[]
      taskIds?: number[]
    },
  ): Promise<CollaboratorReport> => {
    const params = new URLSearchParams()
    if (options?.startDate) params.append("startDate", options.startDate)
    if (options?.endDate) params.append("endDate", options.endDate)
    if (options?.periodType) params.append("periodType", options.periodType)
    if (options?.projectIds?.length) params.append("projectIds", options.projectIds.join(","))
    if (options?.taskIds?.length) params.append("taskIds", options.taskIds.join(","))

    const response = await fetch(`${API_BASE_URL}/reports/collaborators/${email}?${params}`)
    if (!response.ok) throw new Error("Failed to fetch collaborator report")
    return response.json()
  },

  // Get reports for all collaborators
  getAllCollaboratorReports: async (options?: {
    startDate?: string
    endDate?: string
    periodType?: PeriodType
    collaboratorEmails?: string[]
    projectIds?: number[]
    taskIds?: number[]
  }): Promise<CollaboratorReport[]> => {
    const params = new URLSearchParams()
    if (options?.startDate) params.append("startDate", options.startDate)
    if (options?.endDate) params.append("endDate", options.endDate)
    if (options?.periodType) params.append("periodType", options.periodType)
    if (options?.collaboratorEmails?.length) params.append("collaboratorEmails", options.collaboratorEmails.join(","))
    if (options?.projectIds?.length) params.append("projectIds", options.projectIds.join(","))
    if (options?.taskIds?.length) params.append("taskIds", options.taskIds.join(","))

    const response = await fetch(`${API_BASE_URL}/reports/collaborators?${params}`)
    if (!response.ok) throw new Error("Failed to fetch collaborator reports")
    return response.json()
  },

  // Get report for a specific client
  getClientReport: async (
    clientId: number,
    options?: {
      startDate?: string
      endDate?: string
      periodType?: PeriodType
      collaboratorEmails?: string[]
      projectIds?: number[]
      taskIds?: number[]
    },
  ): Promise<ClientReport> => {
    const params = new URLSearchParams()
    if (options?.startDate) params.append("startDate", options.startDate)
    if (options?.endDate) params.append("endDate", options.endDate)
    if (options?.periodType) params.append("periodType", options.periodType)
    if (options?.collaboratorEmails?.length) params.append("collaboratorEmails", options.collaboratorEmails.join(","))
    if (options?.projectIds?.length) params.append("projectIds", options.projectIds.join(","))
    if (options?.taskIds?.length) params.append("taskIds", options.taskIds.join(","))

    const response = await fetch(`${API_BASE_URL}/reports/clients/${clientId}?${params}`)
    if (!response.ok) throw new Error("Failed to fetch client report")
    return response.json()
  },

  // Get reports for all clients
  getAllClientReports: async (options?: {
    startDate?: string
    endDate?: string
    periodType?: PeriodType
    collaboratorEmails?: string[]
    projectIds?: number[]
    taskIds?: number[]
  }): Promise<ClientReport[]> => {
    const params = new URLSearchParams()
    if (options?.startDate) params.append("startDate", options.startDate)
    if (options?.endDate) params.append("endDate", options.endDate)
    if (options?.periodType) params.append("periodType", options.periodType)
    if (options?.collaboratorEmails?.length) params.append("collaboratorEmails", options.collaboratorEmails.join(","))
    if (options?.projectIds?.length) params.append("projectIds", options.projectIds.join(","))
    if (options?.taskIds?.length) params.append("taskIds", options.taskIds.join(","))

    const response = await fetch(`${API_BASE_URL}/reports/clients?${params}`)
    if (!response.ok) throw new Error("Failed to fetch client reports")
    return response.json()
  },
}

export const reportsApi = {
  getCollaboratorReport: reportApi.getCollaboratorReport,
  getAllCollaborators: reportApi.getAllCollaboratorReports,
  getClientReport: reportApi.getClientReport,
  getAllClients: reportApi.getAllClientReports,
}
