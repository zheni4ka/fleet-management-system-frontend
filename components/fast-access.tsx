import Link from "next/link"

export default function FastAccess() {
  return (
    <div className="w-650px rounded-xl border border-white/10 bg-zinc-900/40 p-6 shadow-sm">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Панель швидкого переходу
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Керування автопарком в один клік
        </p>
      </div>
      <div className="mt-4 flex flex-col gap-3">
        <div className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3.5 transition-all hover:bg-white/10">
          <span className="text-sm font-medium">База водіїв</span>
          <Link
            href="/driver"
            className="text-xs text-muted-foreground transition-colors group-hover:text-blue-400"
          >
            Відкрити +
          </Link>
        </div>
        <Link
          href="/auto"
          className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3.5 transition-all hover:bg-white/10"
        >
          <span className="text-sm font-medium">Облік автомобілів</span>
          <span className="text-xs text-muted-foreground transition-colors group-hover:text-blue-400">
            Відкрити +
          </span>
        </Link>

        <Link
          href="/route"
          className="group flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3.5 transition-all hover:bg-white/10"
        >
          <span className="text-sm font-medium">Логістика маршрутів</span>
          <span className="text-xs text-muted-foreground transition-colors group-hover:text-blue-400">
            Відкрити +
          </span>
        </Link>
      </div>
    </div>
  )
}
