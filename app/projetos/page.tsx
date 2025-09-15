"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { projetoApi, clienteApi, type Projeto, type Cliente } from "@/lib/api"
import { ProjetoForm } from "@/components/projetos/projeto-form"
import { DeleteProjetoDialog } from "@/components/projetos/delete-projeto-dialog"
import { Plus, Search, Edit, Trash2, FolderOpen, Filter } from "lucide-react"

export default function ProjetosPage() {
  const [projetos, setProjetos] = useState<Projeto[]>([])
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [filteredProjetos, setFilteredProjetos] = useState<Projeto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCliente, setSelectedCliente] = useState<string>("all")
  const [showForm, setShowForm] = useState(false)
  const [editingProjeto, setEditingProjeto] = useState<Projeto | undefined>()
  const [deletingProjeto, setDeletingProjeto] = useState<Projeto | null>(null)

  const fetchData = async () => {
    try {
      const [projetosData, clientesData] = await Promise.all([projetoApi.getAll(), clienteApi.getAll()])
      setProjetos(projetosData)
      setClientes(clientesData)
      setFilteredProjetos(projetosData)
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
    let filtered = projetos

    if (searchTerm) {
      filtered = filtered.filter((projeto) => projeto.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    if (selectedCliente !== "all") {
      filtered = filtered.filter((projeto) => projeto.idCliente.toString() === selectedCliente)
    }

    setFilteredProjetos(filtered)
  }, [searchTerm, selectedCliente, projetos])

  const getClienteName = (idCliente: number) => {
    const cliente = clientes.find((c) => c.id === idCliente)
    return cliente?.nomeCliente || "Cliente não encontrado"
  }

  const handleEdit = (projeto: Projeto) => {
    setEditingProjeto(projeto)
    setShowForm(true)
  }

  const handleDelete = (projeto: Projeto) => {
    setDeletingProjeto(projeto)
  }

  const handleFormSuccess = () => {
    fetchData()
    setEditingProjeto(undefined)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingProjeto(undefined)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando projetos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center">
            <FolderOpen className="mr-3 h-8 w-8 text-secondary" />
            Gerenciamento de Projetos
          </h1>
          <p className="text-muted-foreground">Gerencie todos os projetos do sistema</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Projeto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Projetos</CardTitle>
          <CardDescription>
            {filteredProjetos.length} projeto{filteredProjetos.length !== 1 ? "s" : ""} encontrado
            {filteredProjetos.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedCliente} onValueChange={setSelectedCliente}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrar por cliente" />
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
            </div>
          </div>

          {filteredProjetos.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">
                {searchTerm || selectedCliente !== "all" ? "Nenhum projeto encontrado" : "Nenhum projeto cadastrado"}
              </p>
              {!searchTerm && selectedCliente === "all" && (
                <Button onClick={() => setShowForm(true)} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar primeiro projeto
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nome do Projeto</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjetos.map((projeto) => (
                  <TableRow key={projeto.id}>
                    <TableCell className="font-medium">{projeto.id}</TableCell>
                    <TableCell>{projeto.nomeProjeto}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{getClienteName(projeto.idCliente)}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(projeto)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(projeto)}>
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

      <ProjetoForm
        projeto={editingProjeto}
        open={showForm}
        onOpenChange={handleFormClose}
        onSuccess={handleFormSuccess}
      />

      <DeleteProjetoDialog
        projeto={deletingProjeto}
        open={!!deletingProjeto}
        onOpenChange={(open) => !open && setDeletingProjeto(null)}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}
