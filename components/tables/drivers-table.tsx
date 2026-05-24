"use client"

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
import { Driver } from "@/lib/types"

const inter = Inter({ subsets: ['latin'] })


interface DriversTableProps {
  data: Driver[]
}

export function DriversTable({ data }: DriversTableProps) {
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
                {/* Заглушки для майбутніх кнопок редагування/видалення */}
                <div className="flex justify-center gap-2">
                  <Button variant="outline" size="sm">Редагувати</Button>
                  <Button variant="destructive" size="sm">Видалити</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}