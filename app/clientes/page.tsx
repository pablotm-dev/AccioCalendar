"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { clienteApi, type Cliente } from "@/lib/api"
import { ClienteForm } from "@/components/clientes/cliente-form"
import { DeleteClienteDialog } from "@/components/clientes/delete-cliente-dialog"
import { Plus, Search, Edit, Trash2, Users } from "lucide-react"

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingCliente, setEditingCliente] = useState<Cliente | undefined>()
  const [deletingCliente, setDeletingCliente] = useState<Cliente | null>(null)

  const fetchClientes = async () => {
    try {
      const data = await clienteApi.getAll()
      setClientes(data)
      setFilteredClientes(data)
    } catch (error) {
      console.error("Error fetching clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClientes()
  }, [])

  useEffect(() => {
    const filtered = clientes.filter((cliente) => cliente.nomeCliente.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredClientes(filtered)
  }, [searchTerm, clientes])

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setShowForm(true)
  }

  const handleDelete = (cliente: Cliente) => {
    setDeletingCliente(cliente)
  }

  const handleFormSuccess = () => {
    fetchClientes()
    setEditingCliente(undefined)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingCliente(undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando clientes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <Users className="mr-3 h-8 w-8 text-primary" />
            Gerenciamento de Clientes
          </h1>
          <p className="text-muted-foreground">Gerencie todos os clientes do sistema</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Cliente
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClientes.length} cliente{filteredClientes.length !== 1 ? "s" : ""} encontrado
            {filteredClientes.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {filteredClientes.length === 0 ? (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
              </p>
              {!searchTerm && (
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar primeiro cliente
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome do Cliente</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.id}</TableCell>
                    <TableCell>{cliente.nomeCliente}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(cliente)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(cliente)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <ClienteForm
        cliente={editingCliente}
        open={showForm}
        onOpenChange={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <DeleteClienteDialog
        cliente={deletingCliente}
        open={!!deletingCliente}
        onOpenChange={(open) => !open && setDeletingCliente(null)}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
