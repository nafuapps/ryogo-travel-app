import { Pencil } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"

export function RyogoIconButton({ label }: { label: string }) {
  return (
    <div className="flex p-3 lg:pl-4 lg:gap-1 rounded-lg bg-slate-200 dark:bg-slate-700 justify-center items-center hover:bg-slate-300 dark:hover:bg-slate-600 transition">
      <div className="hidden lg:flex">
        <RyogoCaption color="slate">{label}</RyogoCaption>
      </div>
      <RyogoIcon icon={Pencil} size="sm" color="slate" />
    </div>
  )
}
