"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  reportApi,
  type CollaboratorReport,
  type ClientReport,
  type PeriodType,
  type Cliente,
  type Projeto,
} from "@/lib/api"
import { BarChart3, TrendingUp, Users, Building2, Calendar, Download, Search } from "lucide-react"

interface ReportsViewProps {
  clientes: Cliente[]
  projetos: Projeto[]
}

export function ReportsView({ clientes, projetos }: ReportsViewProps) {
  const [collaboratorReports, setCollaboratorReports] = useState<CollaboratorReport[]>([])
  const [clientReports, setClientReports] = useState<ClientReport[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("MONTH")
  const [selectedClient, setSelectedClient] = useState<string>("all")
  const [selectedProject, setSelectedProject] = useState<string>("all")
  const [collaboratorEmail, setCollaboratorEmail] = useState("")

  const fetchReports = async () => {
    setLoading(true)
    try {
      const options = {
        periodType: selectedPeriod,
        projectIds: selectedProject !== "all" ? [Number.parseInt(selectedProject)] : undefined,
      }

      const [collaboratorData, clientData] = await Promise.all([
        reportApi.getAllCollaboratorReports(options),
        reportApi.getAllClientReports(options),
      ])

      setCollaboratorReports(collaboratorData)
      setClientReports(clientData)
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCollaboratorReport = async () => {
    if (!collaboratorEmail) return

    setLoading(true)
    try {
      const options = {
        periodType: selectedPeriod,
        projectIds: selectedProject !== "all" ? [Number.parseInt(selectedProject)] : undefined,
      }

      const report = await reportApi.getCollaboratorReport(collaboratorEmail, options)
      setCollaboratorReports([report])
    } catch (error) {
      console.error("Error fetching collaborator report:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchClientReport = async () => {
    if (selectedClient === "all") return

    setLoading(true)
    try {
      const options = {
        periodType: selectedPeriod,
        projectIds: selectedProject !== "all" ? [Number.parseInt(selectedProject)] : undefined,
      }

      const report = await reportApi.getClientReport(Number.parseInt(selectedClient), options)
      setClientReports([report])
    } catch (error) {
      console.error("Error fetching client report:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [selectedPeriod])

  const formatHours = (hours: number) => `${hours.toFixed(1)}h`

  const getDayName = (dayNumber: string) => {
    const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]
    return days[Number.parseInt(dayNumber) - 1] || dayNumber
  }

  const getMonthName = (monthNumber: string) => {
    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
    return months[Number.parseInt(monthNumber) - 1] || monthNumber
  }

  const exportCollaboratorReport = (report: CollaboratorReport) => {
    const csvContent = [
      ["Colaborador", "Total de Horas", "Projeto", "Horas do Projeto", "Cliente"].join(","),
      ...report.hoursPerProject.map((project) =>
        [
          report.collaboratorEmail,
          formatHours(report.totalHoursWorked),
          `"${project.projectName}"`,
          formatHours(project.hours),
          `"${project.clientName}"`,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `relatorio_${report.collaboratorEmail}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BarChart3 className="mr-2 h-5 w-5 text-primary" />
            Filtros de Relatórios
          </CardTitle>
          <CardDescription>Configure os parâmetros para gerar relatórios personalizados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={selectedPeriod} onValueChange={(value: PeriodType) => setSelectedPeriod(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="WEEK">Semana Atual</SelectItem>
                <SelectItem value="MONTH">Mês Atual</SelectItem>
                <SelectItem value="QUARTER">Trimestre Atual</SelectItem>
                <SelectItem value="YEAR">Ano Atual</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedClient} onValueChange={setSelectedClient}>
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

            <Select value={selectedProject} onValueChange={setSelectedProject}>
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

            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Email do colaborador"
                value={collaboratorEmail}
                onChange={(e) => setCollaboratorEmail(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={fetchReports} disabled={loading}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Gerar Relatórios Gerais
            </Button>
            <Button onClick={fetchCollaboratorReport} disabled={loading || !collaboratorEmail} variant="outline">
              <Users className="mr-2 h-4 w-4" />
              Relatório do Colaborador
            </Button>
            <Button onClick={fetchClientReport} disabled={loading || selectedClient === "all"} variant="outline">
              <Building2 className="mr-2 h-4 w-4" />
              Relatório do Cliente
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="ml-2 text-muted-foreground">Gerando relatórios...</p>
        </div>
      )}

      <Tabs defaultValue="collaborators" className="space-y-4">
        <TabsList>
          <TabsTrigger value="collaborators" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Colaboradores ({collaboratorReports.length})
          </TabsTrigger>
          <TabsTrigger value="clients" className="flex items-center">
            <Building2 className="mr-2 h-4 w-4" />
            Clientes ({clientReports.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collaborators" className="space-y-4">
          {collaboratorReports.map((report) => (
            <Card key={report.collaboratorEmail}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      <Users className="mr-2 h-5 w-5 text-primary" />
                      {report.collaboratorEmail}
                    </CardTitle>
                    <CardDescription>
                      Total: {formatHours(report.totalHoursWorked)} | Sessão média:{" "}
                      {report.contextDetails.averageSessionDurationMinutes.toFixed(0)} min
                    </CardDescription>
                  </div>
                  <Button onClick={() => exportCollaboratorReport(report)} size="sm" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Exportar
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Hours by Project */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    Horas por Projeto
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {report.hoursPerProject.map((project) => (
                      <div
                        key={project.projectId}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <div className="font-medium">{project.projectName}</div>
                          <div className="text-sm text-muted-foreground">{project.clientName}</div>
                        </div>
                        <Badge variant="secondary">{formatHours(project.hours)}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Productivity Analysis */}
                <div>
                  <h4 className="font-medium mb-3 flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Análise de Produtividade
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Hours by Day of Week */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Horas por Dia da Semana</h5>
                      {Object.entries(report.productivityAnalysis.hoursByDayOfWeek).map(([day, hours]) => (
                        <div key={day} className="flex items-center justify-between text-sm">
                          <span>{getDayName(day)}</span>
                          <span className="font-medium">{formatHours(hours)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Hours by Time Period */}
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Distribuição por Período</h5>
                      {Object.entries(report.contextDetails.hoursByTimePeriod).map(([period, hours]) => (
                        <div key={period} className="flex items-center justify-between text-sm">
                          <span>{period === "MORNING" ? "Manhã" : period === "AFTERNOON" ? "Tarde" : "Noite"}</span>
                          <span className="font-medium">{formatHours(hours)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Peak and Low Periods */}
                {(report.productivityAnalysis.peakPeriods.length > 0 ||
                  report.productivityAnalysis.lowPeriods.length > 0) && (
                  <div>
                    <h4 className="font-medium mb-3 flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      Períodos de Pico e Baixa
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {report.productivityAnalysis.peakPeriods.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-green-600 mb-2">Períodos de Pico</h5>
                          {report.productivityAnalysis.peakPeriods.map((period, index) => (
                            <div key={index} className="p-2 bg-green-50 rounded text-sm">
                              <div className="font-medium">{formatHours(period.hours)}</div>
                              <div className="text-muted-foreground">
                                {new Date(period.startDate).toLocaleDateString("pt-BR")} -{" "}
                                {new Date(period.endDate).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {report.productivityAnalysis.lowPeriods.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-orange-600 mb-2">Períodos de Baixa</h5>
                          {report.productivityAnalysis.lowPeriods.map((period, index) => (
                            <div key={index} className="p-2 bg-orange-50 rounded text-sm">
                              <div className="font-medium">{formatHours(period.hours)}</div>
                              <div className="text-muted-foreground">
                                {new Date(period.startDate).toLocaleDateString("pt-BR")} -{" "}
                                {new Date(period.endDate).toLocaleDateString("pt-BR")}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {collaboratorReports.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhum relatório de colaborador encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          {clientReports.map((report) => (
            <Card key={report.clientId}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5 text-primary" />
                  {report.clientName}
                </CardTitle>
                <CardDescription>
                  {report.projects.length} projeto{report.projects.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {report.projects.map((project) => (
                    <div key={project.projectId} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{project.projectName}</h4>
                        <Badge variant="outline">{formatHours(project.totalHours)}</Badge>
                      </div>

                      {/* Collaborator Hours */}
                      <div className="mb-4">
                        <h5 className="text-sm font-medium mb-2">Horas por Colaborador</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {project.collaboratorHours.map((collab) => (
                            <div
                              key={collab.collaboratorEmail}
                              className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded"
                            >
                              <span>{collab.collaboratorEmail}</span>
                              <span className="font-medium">{formatHours(collab.hours)}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Tasks */}
                      {project.tasks.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium mb-2">Tarefas</h5>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Tarefa</TableHead>
                                <TableHead>Total</TableHead>
                                <TableHead>Colaboradores</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {project.tasks.map((task) => (
                                <TableRow key={task.taskId}>
                                  <TableCell className="font-medium">{task.taskName}</TableCell>
                                  <TableCell>{formatHours(task.totalHours)}</TableCell>
                                  <TableCell>
                                    <div className="space-y-1">
                                      {task.collaboratorHours.map((collab) => (
                                        <div key={collab.collaboratorEmail} className="text-xs">
                                          {collab.collaboratorEmail}: {formatHours(collab.hours)}
                                        </div>
                                      ))}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}

          {clientReports.length === 0 && !loading && (
            <Card>
              <CardContent className="text-center py-8">
                <Building2 className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhum relatório de cliente encontrado</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
