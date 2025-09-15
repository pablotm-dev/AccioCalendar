"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Tarefa } from "@/lib/api"
import { ChevronLeft, ChevronRight, Calendar, Clock } from "lucide-react"

interface CalendarViewProps {
  tarefas: Tarefa[]
  projetos: any[]
  clientes: any[]
}

export function CalendarView({ tarefas, projetos, clientes }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

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

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("pt-BR", {
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

  // Get current month and year
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get first day of month and number of days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()
  const startingDayOfWeek = firstDayOfMonth.getDay()

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  // Filter tasks for current month
  const monthTasks = tarefas.filter((tarefa) => {
    const taskDate = new Date(tarefa.dataInicio)
    return taskDate.getMonth() === currentMonth && taskDate.getFullYear() === currentYear
  })

  // Group tasks by day
  const tasksByDay = monthTasks.reduce(
    (acc, tarefa) => {
      const day = new Date(tarefa.dataInicio).getDate()
      if (!acc[day]) acc[day] = []
      acc[day].push(tarefa)
      return acc
    },
    {} as Record<number, Tarefa[]>,
  )

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-primary" />
            Visualização em Calendário
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-medium min-w-[200px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`min-h-[100px] p-1 border rounded-md ${
                day ? "bg-background hover:bg-muted/50" : "bg-muted/20"
              }`}
            >
              {day && (
                <>
                  <div className="text-sm font-medium mb-1">{day}</div>
                  <div className="space-y-1">
                    {tasksByDay[day]?.slice(0, 2).map((tarefa) => (
                      <div
                        key={tarefa.id}
                        className="text-xs p-1 rounded bg-primary/10 text-primary border border-primary/20"
                      >
                        <div className="font-medium truncate">{tarefa.nomeTask}</div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="mr-1 h-2 w-2" />
                          {formatTime(tarefa.dataInicio)} - {formatTime(tarefa.dataFim)}
                        </div>
                      </div>
                    ))}
                    {tasksByDay[day]?.length > 2 && (
                      <div className="text-xs text-muted-foreground text-center">
                        +{tasksByDay[day].length - 2} mais
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {monthTasks.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Calendar className="mx-auto h-12 w-12 mb-2" />
            <p>
              Nenhuma tarefa encontrada para {monthNames[currentMonth]} {currentYear}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
