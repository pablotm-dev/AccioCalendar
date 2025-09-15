"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { tarefaApi, projetoApi, clienteApi, type Tarefa, type Projeto, type Cliente } from "@/lib/api"
import { CalendarView } from "@/components/apontamentos/calendar-view"
import { Search, Download, Calendar, List, Clock, BarChart3 } from "lucide-react"

export default function ApontamentosPage() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredTarefas, setFilteredTarefas] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<string>("all")
  const [selectedProjeto, setSelectedProjeto] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

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

    if (dateFrom) {
      filtered = filtered.filter((tarefa) => new Date(tarefa.dataInicio) >= new Date(dateFrom))
    }

    if (dateTo) {
      filtered = filtered.filter((tarefa) => new Date(tarefa.dataFim) <= new Date(dateTo + "T23:59:59"))
    }

    setFilteredTarefas(filtered)
  }, [searchTerm, selectedCliente, selectedProjeto, selectedStatus, dateFrom, dateTo, tarefas, projetos])

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

  const calculateTotalHours = () => {
    return filteredTarefas.reduce((total, tarefa) => {
      const inicio = new Date(tarefa.dataInicio)
      const fim = new Date(tarefa.dataFim)
      const diffMs = fim.getTime() - inicio.getTime()
      const diffHours = diffMs / (1000 * 60 * 60)
      return total + diffHours
    }, 0)
  }

  const exportData = () => {
    const csvContent = [
      ["Tag", "Nome", "Descrição", "Projeto", "Cliente", "Início", "Fim", "Duração", "Status"].join(","),
      ...filteredTarefas.map((tarefa) =>
        [
          tarefa.tagTask,
          `"${tarefa.nomeTask}"`,
          `"${tarefa.descricaoTask}"`,
          `"${getProjetoName(tarefa.idProjeto)}"`,
          `"${getClienteByProjeto(tarefa.idProjeto)}"`,
          formatDateTime(tarefa.dataInicio),
          formatDateTime(tarefa.dataFim),
          calculateDuration(tarefa.dataInicio, tarefa.dataFim),
          tarefa.isAtivo ? "Ativo" : "Inativo",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `apontamentos_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando apontamentos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Clock className="mr-3 h-8 w-8 text-chart-5" />
            Consulta de Apontamentos
          </h1>
          <p className="text-muted-foreground">Visualize e analise todos os apontamentos de tempo</p>
        </div>
        <Button onClick={exportData} disabled={filteredTarefas.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Apontamentos</CardTitle>
            <List className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{filteredTarefas.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Horas</CardTitle>
            <Clock className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{calculateTotalHours().toFixed(1)}h</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Apontamentos Ativos</CardTitle>
            <BarChart3 className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{filteredTarefas.filter((t) => t.isAtivo).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros Avançados</CardTitle>
          <CardDescription>Use os filtros abaixo para refinar sua consulta</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select value={selectedCliente} onValueChange={setSelectedCliente}>
              <SelectTrigger>
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
              <SelectTrigger>
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
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="inativo">Inativo</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="Data início"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <Input type="date" placeholder="Data fim" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Views */}
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center">
            <List className="mr-2 h-4 w-4" />
            Lista
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            Calendário
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Apontamentos</CardTitle>
              <CardDescription>
                {filteredTarefas.length} apontamento{filteredTarefas.length !== 1 ? "s" : ""} encontrado
                {filteredTarefas.length !== 1 ? "s" : ""}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTarefas.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground">Nenhum apontamento encontrado</p>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar">
          <CalendarView tarefas={filteredTarefas} projetos={projetos} clientes={clientes} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
