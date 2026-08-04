import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { ChevronRight } from "lucide-react"

export type SupportFAQItemType = {
  question: string
  answer: string
}

export function SupportFAQWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center divide-y items-center w-full">
      {children}
    </div>
  )
}

export function SupportFAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return (
    <details className="group flex flex-col gap-1 lg:gap-1.5 w-full p-3 lg:p-4">
      <summary className="flex items-center gap-2 lg:gap-3">
        <div
          className="flex items-center justify-center shrink-0 transition rounded-lg bg-slate-200 dark:bg-slate-800 p-1.5 lg:p-2 
             group-open:rotate-90"
        >
          <RyogoIcon color="black" size="sm" icon={ChevronRight} thick />
        </div>
        <RyogoSmall weight="font-bold">{question}</RyogoSmall>
      </summary>
      <RyogoCaption color="slate">{answer}</RyogoCaption>
    </details>
  )
}
