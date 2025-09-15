"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { clienteApi, type Cliente } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface ClienteFormProps {
  cliente?: Cliente
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ClienteForm({ cliente, open, onOpenChange, onSuccess }: ClienteFormProps) {
  const [nomeCliente, setNomeCliente] = useState(cliente?.nomeCliente || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!cliente

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (isEditing) {
        await clienteApi.update(cliente.id, { nomeCliente })
      } else {
        await clienteApi.create({ nomeCliente })
      }
      onSuccess()
      onOpenChange(false)
      setNomeCliente("")
    } catch (err) {
      setError(`Erro ao ${isEditing ? "atualizar" : "criar"} cliente. Tente novamente.`)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setNomeCliente(cliente?.nomeCliente || "")
      setError("")
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Atualize as informações do cliente." : "Adicione um novo cliente ao sistema."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCliente">Nome do Cliente</Label>
              <Input
                id="nomeCliente"
                value={nomeCliente}
                onChange={(e) => setNomeCliente(e.target.value)}
                placeholder="Digite o nome do cliente"
                required
              />
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
            <Button type="submit" disabled={loading || !nomeCliente.trim()}>
              {loading ? "Salvando..." : isEditing ? "Atualizar" : "Criar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
