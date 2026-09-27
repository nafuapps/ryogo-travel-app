import { RyogoCaption } from "@/components/typography"

export default function RyogoRoundedDashedTag({ label }: { label: string }) {
  return (
    <div className="flex items-center">
      <div className="w-2 lg:w-3 h-px bg-slate-100 dark:bg-slate-700" />
      <div className="flex items-center justify-center rounded-full py-0.75 lg:py-1 px-2 lg:px-3 border">
        <RyogoCaption color="light" className="text-nowrap">
          {label}
        </RyogoCaption>
      </div>
      <div className="w-2 lg:w-3 h-px bg-slate-100 dark:bg-slate-700" />
    </div>
  )
}
