"use client"

import { useState, useEffect, ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import ModalWindow from "@/components/ui/modal-window"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { AutoMaintenance } from "@/lib/types"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

interface Props {
  autoId: number
  autoTitle: string 
}

export default function AutoMaintenanceModal({ autoId, autoTitle }: Props) {
  const router = useRouter()
  const base = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? ""

  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState<AutoMaintenance[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const [form, setForm] = useState({
    name: "",
    description: "",
    serviceDate: "",
  })


  useEffect(() => {
    if (!isOpen) return

    const fetchHistory = async () => {
      setIsLoading(true)
      try {
        const token = getCookie("token")
        const res = await fetch(`${base ? base : ""}/api/AutoMaintenance/auto/${autoId}`, {
          headers: {
             "Authorization": `Bearer ${token}`
          }
        })
        if (!res.ok) throw new Error("Не вдалося завантажити історію ТО")
        const data = await res.json()
        setHistory(data)
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchHistory()
  }, [isOpen, autoId, base])

  const handleChange = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSave = async () => {
    if (!form.name || !form.description || !form.serviceDate) {
      toast.error("Заповніть всі поля!")
      return
    }

    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації.")
      return
    }

    const savePromise = fetch(`${base ? base : ""}/api/AutoMaintenance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        serviceDate: new Date(form.serviceDate).toISOString(), // Форматуємо дату для C#
        autoId: autoId,
      }),
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Помилка сервера")
      }
    })

    toast.promise(savePromise, {
      loading: "Збереження запису...",
      success: "Автомобіль відправлено на ТО!",
      error: (err) => err.message || "Помилка при створенні запису.",
    })

    try {
      await savePromise
      setForm({ name: "", description: "", serviceDate: "" })
      setIsOpen(false)
      router.refresh() 
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
        onClick={() => setIsOpen(true)}
      >
        ТО
      </Button>

      <ModalWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        title={`Технічне обслуговування: ${autoTitle}`}
      >
        <div className="space-y-5 px-2">
          
          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>
              <h3 className="text-sm font-semibold text-slate-700">Історія обслуговування</h3>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <p className="text-sm text-slate-500 animate-pulse">Завантаження...</p>
              </div>
            ) : history.length === 0 ? (
              <div className="rounded-md border border-dashed border-slate-300 py-4 text-center bg-slate-50">
                <p className="text-sm text-slate-500">Записів ще немає. Автомобіль справний.</p>
              </div>
            ) : (
              <div className="max-h-36 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {history.map((record) => (
                  <div key={record.id} className="rounded-md border border-slate-200 bg-slate-50 p-3">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-slate-800 text-sm">{record.name}</span>
                      <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                        {new Date(record.serviceDate).toLocaleDateString('uk-UA')}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600">{record.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
              <h3 className="text-sm font-semibold text-slate-700">Відправити на ремонт</h3>
            </div>
            
            <div className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Тип робіт (напр., Заміна мастила)"
                  value={form.name}
                  onChange={handleChange("name")}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <textarea
                  placeholder="Детальний опис проблеми..."
                  value={form.description}
                  onChange={handleChange("description")}
                  rows={2}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="space-y-1 text-left flex flex-col">
                <label className="text-xs font-medium text-slate-600 block mb-1">Дата початку робіт</label>
                <input
                  type="datetime-local"
                  value={form.serviceDate}
                  onChange={handleChange("serviceDate")}
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2">
                <Button 
                  onClick={handleSave} 
                  className="w-full bg-blue-600 text-white hover:bg-blue-700 h-9"
                >
                  Зареєструвати ТО
                </Button>
              </div>
            </div>
          </div>

        </div>
      </ModalWindow>
    </>
  )
}