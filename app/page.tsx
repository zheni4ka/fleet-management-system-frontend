import { Button } from "@/components/ui/button"
import Image from "next/image"
import favicon from "./favicon.ico";
import KpiPanel from '@/components/dashboard/KpiPanel'
import MapEmbed from '@/components/dashboard/MapEmbed'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="flex flex-col min-h-svh p-6 pt-20 space-y-6">
      <div className="w-full">
        <h1 className="text-2xl font-semibold mb-4">Панель управління флотом</h1>
        <KpiPanel />
      </div>

      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-lg font-medium mb-3">Карта маршрутів</h2>
          <MapEmbed />
        </div>

        <aside className="lg:col-span-1 p-4 bg-white/3 rounded-lg border border-white/5">
          <h2 className="font-medium">Швидкі дії</h2>
          <div className="mt-3 flex flex-col gap-2">
              <Link href="/driver">Додати водія</Link>
              <Link href="/auto">Додати автомобіль</Link>
              <Link href="/route">Додати маршрут</Link>
          </div>
          <div className="mt-4 font-mono text-xs text-muted-foreground">
            (Натисніть кнопки, щоб відкрити модалки додавання)
          </div>
        </aside>
      </div>
    </div>
  )
}
