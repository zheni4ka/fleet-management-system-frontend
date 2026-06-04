"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const apiBase = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? ""

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const res = await fetch(`${apiBase}/api/Account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || "Неправильне ім'я користувача або пароль.")
      }

      const data = await res.json() 

      
      const maxAge = 24 * 60 * 60
      document.cookie = `token=${data.token}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `username=${data.username}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `roles=${JSON.stringify(data.roles)}; path=/; max-age=${maxAge}; SameSite=Lax`

      router.push("/")
      router.refresh()
    } catch (err: any) {
      setError(err.message || "Сталася помилка при вході.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 border bg-white p-8 rounded-xl shadow-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
            Вхід у систему
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Fleet Management System
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-500 border border-red-200">
              ⚠️ {error}
            </div>
          )}
          <div className="space-y-4 rounded-md">
            <div>
              <label className="text-sm font-medium text-slate-700">Ім&apos;я користувача або Email</label>
              <Input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin або admin@gmail.com"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Пароль</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-transform duration-200 active:scale-95"
          >
            {isLoading ? "Вхід..." : "Увійти"}
          </Button>
        </form>
      </div>
    </div>
  )
}