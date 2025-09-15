"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { projetoApi, clienteApi, type Projeto, type Cliente } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ProjetoFormProps {
  projeto?: Projeto
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ProjetoForm({ projeto, open, onOpenChange, onSuccess }: ProjetoFormProps) {
  const [nomeProjeto, setNomeProjeto] = useState(projeto?.nomeProjeto || "")
  const [idCliente, setIdCliente] = useState<string>(projeto?.idCliente?.toString() || "")
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingClientes, setLoadingClientes] = useState(true)
  const [error, setError] = useState("")

  const isEditing = !!projeto

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const data = await clienteApi.getAll()
        setClientes(data)
      } catch (err) {
        setError("Erro ao carregar clientes")
      } finally {
        setLoadingClientes(false)
      }
    }

    if (open) {
      fetchClientes()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const projetoData = {
        nomeProjeto,
        idCliente: Number.parseInt(idCliente),
      }

      if (isEditing) {
        await projetoApi.update(projeto.id, projetoData)
      } else {
        await projetoApi.create(projetoData)
      }
      onSuccess()
      onOpenChange(false)
      setNomeProjeto("")
      setIdCliente("")
    } catch (err) {
      setError(`Erro ao ${isEditing ? "atualizar" : "criar"} projeto. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNomeProjeto(projeto?.nomeProjeto || "")
      setIdCliente(projeto?.idCliente?.toString() || "")
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Projeto" : "Novo Projeto"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações do projeto." : "Adicione um novo projeto ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nomeProjeto">Nome do Projeto</Label>
              <Input
                id="nomeProjeto"
                value={nomeProjeto}
                onChange={(e) => setNomeProjeto(e.target.value)}
                placeholder="Digite o nome do projeto"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cliente">Cliente</Label>
              {loadingClientes ? (
                <div className="text-sm text-muted-foreground">Carregando clientes...</div>
              ) : (
                <Select value={idCliente} onValueChange={setIdCliente} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id.toString()}>
                        {cliente.nomeCliente}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
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
            <Button type="submit" disabled={loading || !nomeProjeto.trim() || !idCliente || loadingClientes}>
              {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
