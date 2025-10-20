"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Download } from "lucide-react"

interface DateFilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDownload: (startDate?: string, endDate?: string) => Promise<void>
  title: string
  description: string
}

export function DateFilterModal({ open, onOpenChange, onDownload, title, description }: DateFilterModalProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [loading, setLoading] = useState(false)

  const handleDownload = async () => {
    setLoading(true)
    try {
      // Convert dates to ISO-8601 format if provided
      const startDateISO = startDate ? new Date(startDate).toISOString() : undefined
      const endDateISO = endDate ? new Date(endDate).toISOString() : undefined

      await onDownload(startDateISO, endDateISO)
      onOpenChange(false)
      setStartDate("")
      setEndDate("")
    } catch (error) {
      console.error("Error downloading report:", error)
      alert("Erro ao baixar relatório. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-chart-1" />
            {title}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="startDate">Data Início (opcional)</Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Selecione a data de início"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endDate">Data Fim (opcional)</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="Selecione a data de fim"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Se as datas não forem fornecidas, o relatório incluirá todos os dados disponíveis erro.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button onClick={handleDownload} disabled={loading}>
            {loading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                Baixando...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Baixar Excel
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
