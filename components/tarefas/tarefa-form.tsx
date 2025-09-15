"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { tarefaApi, projetoApi, clienteApi, type Tarefa, type Projeto, type Cliente } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface TarefaFormProps {
  tarefa?: Tarefa
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TarefaForm({ tarefa, open, onOpenChange, onSuccess }: TarefaFormProps) {
  const [nomeTask, setNomeTask] = useState(tarefa?.nomeTask || "")
  const [descricaoTask, setDescricaoTask] = useState(tarefa?.descricaoTask || "")
  const [idProjeto, setIdProjeto] = useState<string>(tarefa?.idProjeto?.toString() || "")
  const [tagTask, setTagTask] = useState(tarefa?.tagTask || "")
  const [dataInicio, setDataInicio] = useState(
    tarefa?.dataInicio ? new Date(tarefa.dataInicio).toISOString().slice(0, 16) : "",
  )
  const [dataFim, setDataFim] = useState(tarefa?.dataFim ? new Date(tarefa.dataFim).toISOString().slice(0, 16) : "")
  const [isAtivo, setIsAtivo] = useState(tarefa?.isAtivo ?? true)
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [error, setError] = useState("")

  const isEditing = !!tarefa

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projetosData, clientesData] = await Promise.all([projetoApi.getAll(), clienteApi.getAll()])
        setProjetos(projetosData)
        setClientes(clientesData)
      } catch (err) {
        setError("Erro ao carregar dados")
      } finally {
        setLoadingData(false)
      }
    }

    if (open) {
      fetchData()
    }
  }, [open])

  const getClienteName = (idCliente: number) => {
    const cliente = clientes.find((c) => c.id === idCliente)
    return cliente?.nomeCliente || "Cliente não encontrado"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const tarefaData = {
        nomeTask,
        descricaoTask,
        idProjeto: Number.parseInt(idProjeto),
        tagTask,
        dataInicio: new Date(dataInicio).toISOString(),
        dataFim: new Date(dataFim).toISOString(),
        isAtivo,
      }

      if (isEditing) {
        await tarefaApi.update(tarefa.id, tarefaData)
      } else {
        await tarefaApi.create(tarefaData)
      }
      onSuccess()
      onOpenChange(false)
      resetForm()
    } catch (err) {
      setError(`Erro ao ${isEditing ? "atualizar" : "criar"} tarefa. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setNomeTask("")
    setDescricaoTask("")
    setIdProjeto("")
    setTagTask("")
    setDataInicio("")
    setDataFim("")
    setIsAtivo(true)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      if (tarefa) {
        setNomeTask(tarefa.nomeTask)
        setDescricaoTask(tarefa.descricaoTask)
        setIdProjeto(tarefa.idProjeto.toString())
        setTagTask(tarefa.tagTask)
        setDataInicio(new Date(tarefa.dataInicio).toISOString().slice(0, 16))
        setDataFim(new Date(tarefa.dataFim).toISOString().slice(0, 16))
        setIsAtivo(tarefa.isAtivo)
      } else {
        resetForm()
      }
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações da tarefa." : "Adicione uma nova tarefa ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeTask">Nome da Tarefa</Label>
                <Input
                  id="nomeTask"
                  value={nomeTask}
                  onChange={(e) => setNomeTask(e.target.value)}
                  placeholder="Digite o nome da tarefa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tagTask">Tag da Tarefa</Label>
                <Input
                  id="tagTask"
                  value={tagTask}
                  onChange={(e) => setTagTask(e.target.value)}
                  placeholder="Ex: TAG-001"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricaoTask">Descrição</Label>
              <Textarea
                id="descricaoTask"
                value={descricaoTask}
                onChange={(e) => setDescricaoTask(e.target.value)}
                placeholder="Digite a descrição da tarefa"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projeto">Projeto</Label>
              {loadingData ? (
                <div className="text-sm text-muted-foreground">Carregando projetos...</div>
              ) : (
                <Select value={idProjeto} onValueChange={setIdProjeto} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um projeto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projetos.map((projeto) => (
                      <SelectItem key={projeto.id} value={projeto.id.toString()}>
                        {projeto.nomeProjeto} - {getClienteName(projeto.idCliente)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dataInicio">Data/Hora de Início</Label>
                <Input
                  id="dataInicio"
                  type="datetime-local"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dataFim">Data/Hora de Fim</Label>
                <Input
                  id="dataFim"
                  type="datetime-local"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch id="isAtivo" checked={isAtivo} onCheckedChange={setIsAtivo} />
              <Label htmlFor="isAtivo">Tarefa ativa</Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !nomeTask.trim() ||
                !descricaoTask.trim() ||
                !idProjeto ||
                !tagTask.trim() ||
                !dataInicio ||
                !dataFim ||
                loadingData
              }
            >
              {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
