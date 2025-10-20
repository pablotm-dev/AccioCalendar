"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  reportsApi,
  clienteApi,
  projetoApi,
  type Cliente,
  type Projeto,
  type CollaboratorReport,
  type ClientReport,
} from "@/lib/api"
import {
  Search,
  Download,
  BarChart3,
  Users,
  Building2,
  TrendingUp,
  Clock,
  FileText,
  FileSpreadsheet,
} from "lucide-react"
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { DateFilterModal } from "@/components/apontamentos/date-filter-modal"

export default function ApontamentosPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [collaboratorReports, setCollaboratorReports] = useState<CollaboratorReport[]>([])
  const [clientReports, setClientReports] = useState<ClientReport[]>([])
  const [selectedCollaborator, setSelectedCollaborator] = useState<CollaboratorReport | null>(null)
  const [selectedClient, setSelectedClient] = useState<ClientReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchEmail, setSearchEmail] = useState("")
  const [selectedClientId, setSelectedClientId] = useState<string>("all")
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [excelModalOpen, setExcelModalOpen] = useState(false)
  const [excelModalType, setExcelModalType] = useState<"collaborator" | "client">("collaborator")
  const [selectedEmailForExcel, setSelectedEmailForExcel] = useState("")
  const [selectedClientIdForExcel, setSelectedClientIdForExcel] = useState(0)

  const fetchData = async () => {
    try {
      const [clientesData, projetosData, collaboratorReportsData, clientReportsData] = await Promise.all([
        clienteApi.getAll(),
        projetoApi.getAll(),
        reportsApi.getAllCollaborators(),
        reportsApi.getAllClients(),
      ])
      setClientes(clientesData)
      setProjetos(projetosData)
      setCollaboratorReports(collaboratorReportsData)
      setClientReports(clientReportsData)
    } catch (error) {
      console.error("Error fetching reports data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const searchCollaborator = async () => {
    if (!searchEmail.trim()) return

    try {
      const report = await reportsApi.getCollaboratorReport(searchEmail)
      setSelectedCollaborator(report)
    } catch (error) {
      console.error("Error fetching collaborator report:", error)
      setSelectedCollaborator(null)
    }
  }

  const viewClientReport = async (clientId: number) => {
    try {
      const report = await reportsApi.getClientReport(clientId)
      setSelectedClient(report)
    } catch (error) {
      console.error("Error fetching client report:", error)
    }
  }

  const exportCollaboratorData = () => {
    if (!collaboratorReports.length) return

    const csvContent = [
      ["Email", "Total Horas", "Projetos", "Tarefas"].join(","),
      ...collaboratorReports.map((report) =>
        [
          report.collaboratorEmail,
          (report.totalHoursWorked ?? 0).toFixed(1),
          report.hoursPerProject?.length ?? 0,
          report.hoursPerTask?.length ?? 0,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `relatorio_colaboradores_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportClientData = () => {
    if (!clientReports.length) return

    const csvContent = [
      ["Cliente", "Projetos", "Total Horas"].join(","),
      ...clientReports.map((report) =>
        [
          `"${report.clientName}"`,
          report.projects?.length ?? 0,
          report.projects?.reduce((sum, p) => sum + (p.totalHours ?? 0), 0).toFixed(1) ?? "0.0",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `relatorio_clientes_${new Date().toISOString().split("T")[0]}.csv`)
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
          <p className="mt-2 text-muted-foreground">Carregando relatórios...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <BarChart3 className="mr-3 h-8 w-8 text-chart-1" />
            Relatórios de Apontamentos
          </h1>
          <p className="text-muted-foreground">Análise detalhada de produtividade e performance</p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
            <Users className="h-4 w-4 text-chart-1" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-1">{collaboratorReports.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Building2 className="h-4 w-4 text-chart-2" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-2">{clientReports.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Horas (Colaboradores)</CardTitle>
            <Clock className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-3">
              {collaboratorReports.reduce((total, report) => total + (report.totalHoursWorked ?? 0), 0).toFixed(1)}h
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tarefas</CardTitle>
            <FileText className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-4">
              {collaboratorReports.reduce((total, report) => total + (report.hoursPerTask?.length ?? 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="collaborators" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collaborators" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Colaboradores
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            Clientes
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center">
            <Search className="mr-2 h-4 w-4" />
            Busca Específica
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaborators">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Relatórios de Colaboradores</h2>
              <Button onClick={exportCollaboratorData} disabled={collaboratorReports.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Total Horas</TableHead>
                      <TableHead>Projetos</TableHead>
                      <TableHead>Tarefas</TableHead>
                      <TableHead>Período Pico</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {collaboratorReports.map((report) => (
                      <TableRow key={report.collaboratorEmail}>
                        <TableCell className="font-medium">{report.collaboratorEmail}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="mr-1 h-3 w-3" />
                            {(report.totalHoursWorked ?? 0).toFixed(1)}h
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{report.hoursPerProject?.length ?? 0}</Badge>
                        </TableCell>
                        <TableCell>{report.hoursPerTask?.length ?? 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                            <span className="text-sm text-green-600">
                              {report.productivityAnalysis?.peakPeriods?.[0]
                                ? `${new Date(report.productivityAnalysis.peakPeriods[0].startDate).toLocaleDateString()}`
                                : "N/A"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedEmailForExcel(report.collaboratorEmail)
                              setExcelModalType("collaborator")
                              setExcelModalOpen(true)
                            }}
                          >
                            <FileSpreadsheet className="mr-2 h-4 w-4" />
                            Excel
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="clients">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Relatórios de Clientes</h2>
              <Button onClick={exportClientData} disabled={clientReports.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Exportar CSV
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientReports.map((report) => {
                const totalHours = report.projects?.reduce((sum, p) => sum + (p.totalHours ?? 0), 0) ?? 0
                const totalTasks = report.projects?.reduce((sum, p) => sum + (p.tasks?.length ?? 0), 0) ?? 0
                const totalCollaborators = new Set(
                  report.projects?.flatMap((p) => p.collaboratorHours?.map((c) => c.collaboratorEmail) ?? []),
                ).size

                return (
                  <Card key={report.clientId} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="truncate">{report.clientName}</span>
                        <Building2 className="h-5 w-5 text-chart-2" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Horas:</span>
                          <span className="font-medium">{totalHours.toFixed(1)}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tarefas:</span>
                          <span className="font-medium">{totalTasks}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Projetos:</span>
                          <span className="font-medium">{report.projects?.length ?? 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Colaboradores:</span>
                          <span className="font-medium">{totalCollaborators}</span>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 bg-transparent"
                            onClick={() => viewClientReport(report.clientId)}
                          >
                            Ver Detalhes
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => {
                              setSelectedClientIdForExcel(report.clientId)
                              setExcelModalType("client")
                              setExcelModalOpen(true)
                            }}
                          >
                            <FileSpreadsheet className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="search">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Busca Específica de Colaborador</CardTitle>
                <CardDescription>Digite o email do colaborador para ver relatório detalhado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="email@exemplo.com"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && searchCollaborator()}
                  />
                  <Button onClick={searchCollaborator} disabled={!searchEmail.trim()}>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {selectedCollaborator && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="bg-gradient-to-br from-chart-1/10 to-chart-1/5 border-chart-1/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-chart-1" />
                        Total de Horas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-chart-1">
                        {(selectedCollaborator.totalHoursWorked ?? 0).toFixed(1)}h
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-chart-2/10 to-chart-2/5 border-chart-2/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <FileText className="mr-2 h-4 w-4 text-chart-2" />
                        Total de Tarefas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-chart-2">
                        {selectedCollaborator.hoursPerTask?.length ?? 0}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-chart-3/10 to-chart-3/5 border-chart-3/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4 text-chart-3" />
                        Projetos Ativos
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-chart-3">
                        {selectedCollaborator.hoursPerProject?.length ?? 0}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-chart-4/10 to-chart-4/5 border-chart-4/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                        <TrendingUp className="mr-2 h-4 w-4 text-chart-4" />
                        Duração Média
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-chart-4">
                        {(selectedCollaborator.contextDetails?.averageSessionDurationMinutes ?? 0).toFixed(0)} min
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Bar Chart - Hours per Project */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="mr-2 h-5 w-5 text-chart-1" />
                        Horas por Projeto
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart
                          data={selectedCollaborator.hoursPerProject?.slice(0, 5).map((p, index) => ({
                            name: p.projectName.length > 15 ? p.projectName.substring(0, 15) + "..." : p.projectName,
                            horas: p.hours ?? 0,
                            fill: `hsl(var(--chart-${(index % 5) + 1}))`,
                          }))}
                        >
                          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="horas" radius={[8, 8, 0, 0]}>
                            {selectedCollaborator.hoursPerProject?.slice(0, 5).map((_, index) => (
                              <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${(index % 5) + 1}))`} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Pie Chart - Hours by Time Period */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Clock className="mr-2 h-5 w-5 text-chart-2" />
                        Distribuição por Período
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={[
                              {
                                name: "Manhã",
                                value: selectedCollaborator.contextDetails?.hoursByTimePeriod?.MORNING ?? 0,
                              },
                              {
                                name: "Tarde",
                                value: selectedCollaborator.contextDetails?.hoursByTimePeriod?.AFTERNOON ?? 0,
                              },
                              {
                                name: "Noite",
                                value: selectedCollaborator.contextDetails?.hoursByTimePeriod?.EVENING ?? 0,
                              },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            dataKey="value"
                          >
                            <Cell fill="hsl(var(--chart-1))" />
                            <Cell fill="hsl(var(--chart-2))" />
                            <Cell fill="hsl(var(--chart-3))" />
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Projects Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Building2 className="mr-2 h-5 w-5 text-chart-1" />
                        Projetos
                      </CardTitle>
                      <CardDescription>Distribuição de horas por projeto</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCollaborator.hoursPerProject?.map((project, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/20 hover:from-muted/70 hover:to-muted/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">{project.projectName}</div>
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <Building2 className="mr-1 h-3 w-3" />
                                {project.clientName}
                              </div>
                            </div>
                            <div className="ml-4 flex items-center">
                              <Badge variant="secondary" className="bg-chart-1/10 text-chart-1 border-chart-1/20">
                                {(project.hours ?? 0).toFixed(1)}h
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tasks Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <FileText className="mr-2 h-5 w-5 text-chart-2" />
                        Principais Tarefas
                      </CardTitle>
                      <CardDescription>Top 10 tarefas por tempo dedicado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCollaborator.hoursPerTask?.slice(0, 10).map((task, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-muted/50 to-muted/20 hover:from-muted/70 hover:to-muted/30 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-foreground truncate">{task.taskName}</div>
                              <div className="text-xs text-muted-foreground flex items-center mt-1">
                                <BarChart3 className="mr-1 h-3 w-3" />
                                {task.projectName}
                              </div>
                            </div>
                            <div className="ml-4 flex items-center">
                              <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 border-chart-2/20">
                                {(task.hours ?? 0).toFixed(1)}h
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Clock className="mr-2 h-5 w-5 text-chart-3" />
                      Análise por Período do Dia
                    </CardTitle>
                    <CardDescription>Distribuição de horas trabalhadas ao longo do dia</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-6 rounded-lg bg-gradient-to-br from-chart-1/10 to-chart-1/5 border border-chart-1/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Manhã</span>
                          <Clock className="h-4 w-4 text-chart-1" />
                        </div>
                        <div className="text-3xl font-bold text-chart-1">
                          {(selectedCollaborator.contextDetails?.hoursByTimePeriod?.MORNING ?? 0).toFixed(1)}h
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">06:00 - 12:00</div>
                      </div>

                      <div className="p-6 rounded-lg bg-gradient-to-br from-chart-2/10 to-chart-2/5 border border-chart-2/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Tarde</span>
                          <Clock className="h-4 w-4 text-chart-2" />
                        </div>
                        <div className="text-3xl font-bold text-chart-2">
                          {(selectedCollaborator.contextDetails?.hoursByTimePeriod?.AFTERNOON ?? 0).toFixed(1)}h
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">12:00 - 18:00</div>
                      </div>

                      <div className="p-6 rounded-lg bg-gradient-to-br from-chart-3/10 to-chart-3/5 border border-chart-3/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-muted-foreground">Noite</span>
                          <Clock className="h-4 w-4 text-chart-3" />
                        </div>
                        <div className="text-3xl font-bold text-chart-3">
                          {(selectedCollaborator.contextDetails?.hoursByTimePeriod?.EVENING ?? 0).toFixed(1)}h
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">18:00 - 00:00</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Client Detail Modal */}
      {selectedClient && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Relatório Detalhado - {selectedClient.clientName}</CardTitle>
              <Button variant="outline" onClick={() => setSelectedClient(null)}>
                Fechar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-1">
                  {(selectedClient.projects?.reduce((sum, p) => sum + (p.totalHours ?? 0), 0) ?? 0).toFixed(1)}h
                </div>
                <div className="text-sm text-muted-foreground">Total de Horas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-2">
                  {selectedClient.projects?.reduce((sum, p) => sum + (p.tasks?.length ?? 0), 0) ?? 0}
                </div>
                <div className="text-sm text-muted-foreground">Total de Tarefas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-chart-3">{selectedClient.projects?.length ?? 0}</div>
                <div className="text-sm text-muted-foreground">Projetos</div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold mb-2">Projetos</h4>
                <div className="space-y-2">
                  {selectedClient.projects?.map((project, index) => (
                    <div key={index} className="p-3 bg-muted rounded">
                      <div className="font-medium">{project.projectName}</div>
                      <div className="text-sm text-muted-foreground">
                        {(project.totalHours ?? 0).toFixed(1)}h • {project.tasks?.length ?? 0} tarefas •{" "}
                        {project.collaboratorHours?.length ?? 0} colaboradores
                      </div>
                      {project.tasks && project.tasks.length > 0 && (
                        <div className="mt-2 pl-4 space-y-1">
                          {project.tasks.slice(0, 5).map((task, taskIndex) => (
                            <div key={taskIndex} className="text-xs flex justify-between">
                              <span>{task.taskName}</span>
                              <span className="text-muted-foreground">{(task.totalHours ?? 0).toFixed(1)}h</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* DateFilterModal for Excel downloads */}
      <DateFilterModal
        open={excelModalOpen}
        onOpenChange={setExcelModalOpen}
        onDownload={async (startDate, endDate) => {
          if (excelModalType === "collaborator") {
            await reportsApi.downloadCollaboratorExcel(selectedEmailForExcel, startDate, endDate)
          } else {
            await reportsApi.downloadClientExcel(selectedClientIdForExcel, startDate, endDate)
          }
        }}
        title={excelModalType === "collaborator" ? "Baixar Relatório de Colaborador" : "Baixar Relatório de Cliente"}
        description="Selecione o período para filtrar o relatório. Deixe em branco para incluir todos os dados."
      />
    </div>
  )
}
