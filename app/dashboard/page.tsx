"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { clienteApi, projetoApi, tarefaApi, type Tarefa } from "@/lib/api"
import { Users, FolderOpen, CheckSquare, Clock, Plus, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalClientes: 0,
    totalProjetos: 0,
    totalTarefas: 0,
    tarefasAtivas: 0,
  })
  const [recentTasks, setRecentTasks] = useState<Tarefa[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [clientes, projetos, tarefas] = await Promise.all([
          clienteApi.getAll(),
          projetoApi.getAll(),
          tarefaApi.getAll(),
        ])

        setStats({
          totalClientes: clientes.length,
          totalProjetos: projetos.length,
          totalTarefas: tarefas.length,
          tarefasAtivas: tarefas.filter((t) => t.isAtivo).length,
        })

        // Get recent tasks (last 5)
        const sortedTasks = tarefas
          .sort((a, b) => new Date(b.dataInicio).getTime() - new Date(a.dataInicio).getTime())
          .slice(0, 5)
        setRecentTasks(sortedTasks)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Visão geral do seu sistema de gerenciamento</p>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link href="/tarefas">
              <Plus className="mr-2 h-4 w-4" />
              Nova Tarefa
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Projetos</CardTitle>
            <FolderOpen className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-secondary">{stats.totalProjetos}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Projetos em andamento
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <CheckSquare className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{stats.totalTarefas}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Tarefas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-chart-5">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
            <Clock className="h-4 w-4 text-chart-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-chart-5">{stats.tarefasAtivas}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Em andamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-primary" />
              Apontamentos Recentes
            </CardTitle>
            <CardDescription>Últimas 5 tarefas registradas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {recentTasks.length === 0 ? (
              <div className="text-center py-8">
                <CheckSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">Nenhuma tarefa encontrada</p>
                <Button asChild className="mt-4">
                  <Link href="/tarefas">Criar primeira tarefa</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{task.nomeTask}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-1">{task.descricaoTask}</p>
                      <div className="flex items-center mt-1 space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {task.tagTask}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(task.dataInicio)} • {formatTime(task.dataInicio)} - {formatTime(task.dataFim)}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <Badge variant={task.isAtivo ? "default" : "secondary"}>
                        {task.isAtivo ? "Ativa" : "Inativa"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acesso rápido às principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/clientes">
                <Users className="mr-2 h-4 w-4" />
                Gerenciar Clientes
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/projetos">
                <FolderOpen className="mr-2 h-4 w-4" />
                Gerenciar Projetos
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/tarefas">
                <CheckSquare className="mr-2 h-4 w-4" />
                Gerenciar Tarefas
              </Link>
            </Button>
            <Button asChild className="w-full justify-start bg-transparent" variant="outline">
              <Link href="/apontamentos">
                <Clock className="mr-2 h-4 w-4" />
                Consultar Apontamentos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
