"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { tarefaApi, projetoApi, clienteApi, type Tarefa, type Projeto, type Cliente } from "@/lib/api"
import { TarefaForm } from "@/components/tarefas/tarefa-form"
import { DeleteTarefaDialog } from "@/components/tarefas/delete-tarefa-dialog"
import { Plus, Search, Edit, Trash2, CheckSquare, Filter, Clock } from "lucide-react"

export default function TarefasPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredTarefas, setFilteredTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<string>("all")
  const [selectedProjeto, setSelectedProjeto] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingTarefa, setEditingTarefa] = useState<Tarefa | undefined>()
  const [deletingTarefa, setDeletingTarefa] = useState<Tarefa | null>(null)

  const fetchData = async () => {
    try {
      const [tarefasData, projetosData, clientesData] = await Promise.all([
        tarefaApi.getAll(),
        projetoApi.getAll(),
        clienteApi.getAll(),
      ])
      setTarefas(tarefasData)
      setProjetos(projetosData)
      setClientes(clientesData)
      setFilteredTarefas(tarefasData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    let filtered = tarefas

    if (searchTerm) {
      filtered = filtered.filter(
        (tarefa) =>
          tarefa.nomeTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tarefa.descricaoTask.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tarefa.tagTask.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedCliente !== "all") {
      const clienteProjetos = projetos.filter((p) => p.idCliente.toString() === selectedCliente)
      const projetoIds = clienteProjetos.map((p) => p.id)
      filtered = filtered.filter((tarefa) => projetoIds.includes(tarefa.idProjeto))
    }

    if (selectedProjeto !== "all") {
      filtered = filtered.filter((tarefa) => tarefa.idProjeto.toString() === selectedProjeto)
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((tarefa) => (selectedStatus === "ativo" ? tarefa.isAtivo : !tarefa.isAtivo))
    }

    setFilteredTarefas(filtered)
  }, [searchTerm, selectedCliente, selectedProjeto, selectedStatus, tarefas, projetos])

  const getProjetoName = (idProjeto: number) => {
    const projeto = projetos.find((p) => p.id === idProjeto)
    return projeto?.nomeProjeto || "Projeto não encontrado"
  }

  const getClienteName = (idCliente: number) => {
    const cliente = clientes.find((c) => c.id === idCliente)
    return cliente?.nomeCliente || "Cliente não encontrado"
  }

  const getClienteByProjeto = (idProjeto: number) => {
    const projeto = projetos.find((p) => p.id === idProjeto)
    return projeto ? getClienteName(projeto.idCliente) : "Cliente não encontrado"
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDuration = (dataInicio: string, dataFim: string) => {
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    const diffMs = fim.getTime() - inicio.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    return `${diffHours}h ${diffMinutes}m`
  }

  const handleEdit = (tarefa: Tarefa) => {
    setEditingTarefa(tarefa)
    setShowForm(true)
  }

  const handleDelete = (tarefa: Tarefa) => {
    setDeletingTarefa(tarefa)
  }

  const handleFormSuccess = () => {
    fetchData()
    setEditingTarefa(undefined)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingTarefa(undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando tarefas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <CheckSquare className="mr-3 h-8 w-8 text-accent" />
            Gerenciamento de Tarefas
          </h1>
          <p className="text-muted-foreground">Gerencie todas as tarefas do sistema</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Tarefa
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Tarefas</CardTitle>
          <CardDescription>
            {filteredTarefas.length} tarefa{filteredTarefas.length !== 1 ? "s" : ""} encontrada
            {filteredTarefas.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-2 lg:space-y-0 lg:space-x-2 mb-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar tarefas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os clientes</SelectItem>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id.toString()}>
                      {cliente.nomeCliente}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedProjeto} onValueChange={setSelectedProjeto}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Projeto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os projetos</SelectItem>
                  {projetos.map((projeto) => (
                    <SelectItem key={projeto.id} value={projeto.id.toString()}>
                      {projeto.nomeProjeto}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="inativo">Inativo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredTarefas.length === 0 ? (
            <div className="text-center py-8">
              <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                {searchTerm || selectedCliente !== "all" || selectedProjeto !== "all" || selectedStatus !== "all"
                  ? "Nenhuma tarefa encontrada"
                  : "Nenhuma tarefa cadastrada"}
              </p>
              {!searchTerm && selectedCliente === "all" && selectedProjeto === "all" && selectedStatus === "all" && (
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar primeira tarefa
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tag</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Projeto</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Fim</TableHead>
                    <TableHead>Duração</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTarefas.map((tarefa) => (
                    <TableRow key={tarefa.id}>
                      <TableCell>
                        <Badge variant="outline">{tarefa.tagTask}</Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{tarefa.nomeTask}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">{tarefa.descricaoTask}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{getProjetoName(tarefa.idProjeto)}</Badge>
                      </TableCell>
                      <TableCell>{getClienteByProjeto(tarefa.idProjeto)}</TableCell>
                      <TableCell className="text-sm">{formatDateTime(tarefa.dataInicio)}</TableCell>
                      <TableCell className="text-sm">{formatDateTime(tarefa.dataFim)}</TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {calculateDuration(tarefa.dataInicio, tarefa.dataFim)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={tarefa.isAtivo ? "default" : "secondary"}>
                          {tarefa.isAtivo ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(tarefa)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => handleDelete(tarefa)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TarefaForm tarefa={editingTarefa} open={showForm} onOpenChange={handleFormClose} onSuccess={handleFormSuccess} />

      <DeleteTarefaDialog
        tarefa={deletingTarefa}
        open={!!deletingTarefa}
        onOpenChange={(open) => !open && setDeletingTarefa(null)}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
