"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Inter } from "next/font/google"
import EditDriverModal from "../edit/edit-driver-modal"
import toast from "react-hot-toast"
import { DriversTableProps } from "@/lib/types"

const inter = Inter({ subsets: ['latin'] })

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null
  return null
}


export function DriversTable({ data }: DriversTableProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<number | null>(null);
 

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Ви впевнені, що хочете видалити водія?');
    if (!confirmed) {
      return;
    }

    const token = getCookie("token")
    if (!token) {
      toast.error("Помилка авторизації. Увійдіть в систему.")
      return
    }

    setDeletingId(id);
    
    const base = (process.env as { NEXT_PUBLIC_API_BASE_URL?: string }).NEXT_PUBLIC_API_BASE_URL ?? "";
    const url = base ? `${base}/api/Driver/${id}` : `/api/Driver/${id}`;

    const deletePromise = fetch(url, {
      method: 'DELETE',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || `Помилка сервера: ${res.status}`)
      }
    })

    toast.promise(deletePromise, {
      loading: "Видалення водія...",
      success: "Водій успішно видалений!",
      error: (err) => err.message || "Не вдалося видалити водія",
    })

    try {
      await deletePromise
      router.refresh();
    } catch (error) {
      console.error('Не вдалося видалити водія:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!data || data.length === 0) {
    return <p className="text-muted-foreground">Водіїв не знайдено.</p>
  }

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader className="">
          <TableRow>
            <TableHead className={`w-1/6 ${inter.className}`}>ID</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>Ім&apos;я</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>Прізвище</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>По батькові</TableHead>
            <TableHead className={`w-1/6 ${inter.className}`}>Посвідчення водія</TableHead>
            <TableHead className={`w-1/6 ${inter.className} text-center`}>Операції</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((driver) => (
            <TableRow key={driver.id} className="hover:bg-slate-50/50">
              <TableCell className={`font-mono text-xs ${inter.className}`}>{driver.id}</TableCell>
              <TableCell className={`font-medium ${inter.className}`}>{driver.name}</TableCell>
              <TableCell className={` ${inter.className}`}>{driver.surname}</TableCell>
              <TableCell className={` ${inter.className}`}>{driver.patronymic}</TableCell>
              <TableCell>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  {driver.licenseNumber}
                </span>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  <EditDriverModal driver={driver}/>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(driver.id)}
                    disabled={deletingId === driver.id}
                  >
                    Видалити
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}