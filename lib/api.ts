const getApiBaseUrl = () => {
  // Always use the internal proxy route for client-side requests
  if (typeof window !== "undefined") {
    return "/api/proxy"
  }

  // Server-side: use direct API calls
  const apiEnv = process.env.API_ENV || process.env.NODE_ENV

  if (apiEnv === "prod" || apiEnv === "production") {
    return "http://179.190.40.40:8081"
  }

  return "http://localhost:8081"
}

const API_BASE_URL = getApiBaseUrl()

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
