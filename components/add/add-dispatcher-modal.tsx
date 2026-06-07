"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import toast from "react-hot-toast"

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}

export default function AddDispatcherModal() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Стан для форми
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Отримуємо токен
    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації. Увійдіть в систему.")
      setIsLoading(false)
      return
    }

    const base =
      (process.env as { NEXT_PUBLIC_API_BASE_URL?: string })
        .NEXT_PUBLIC_API_BASE_URL ?? ""
    const url = base ? `${base}/api/Account/register` : `/api/Account/register`

    const promise = fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
        role: "Dispatcher",
      }),
    }).then(async (res) => {
      if (!res.ok) {
        let errorMessage = `Помилка сервера: ${res.status}`
        try {
          const errorData = await res.json()
          if (errorData.detail) errorMessage = errorData.detail
          else if (errorData.title) errorMessage = errorData.title
          else if (errorData.message) errorMessage = errorData.message 
        } catch {
          const text = await res.text()
          if (text) errorMessage = text
        }
        throw new Error(errorMessage)
      }
    })

    toast.promise(promise, {
      loading: "Створення облікового запису...",
      success: "Диспетчера успішно зареєстровано!",
      error: (err) => err.message,
    })

    try {
      await promise
      setOpen(false)
      setUsername("")
      setEmail("")
      setPassword("")
      router.refresh()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 text-white hover:bg-blue-700">
          + Додати диспетчера
        </Button>
      </DialogTrigger>
      <DialogContent className="w-0.5 bg-white">
        <DialogHeader>
          <DialogTitle>Реєстрація нового диспетчера</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">
              Логін (Username)
            </label>
            <Input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="dispatcher_1"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">
              Електронна пошта
            </label>
            <Input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="disp@fleet.com"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Пароль</label>
            <Input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Мінімум 6 символів"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="mr-2"
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {isLoading ? "Збереження..." : "Зберегти"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
