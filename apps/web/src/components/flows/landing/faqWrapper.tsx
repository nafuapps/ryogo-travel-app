import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoP, RyogoSmall } from "@/components/typography"
import { ChevronRight } from "lucide-react"

export function FAQWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center divide-y items-center w-full max-w-4xl mx-auto">
      {children}
    </div>
  )
}

export function FAQItem({
  question,
  answer,
}: {
  question: string
  answer: string
}) {
  return (
    <details className="group flex flex-col gap-3 lg:gap-4 w-full py-5 lg:py-6">
      <summary className="flex items-center gap-2.5 lg:gap-3">
        <div
          className="flex items-center justify-center shrink-0 transition rounded-lg bg-slate-100 dark:bg-slate-800 p-1.5 lg:p-2 ${
          group-open:rotate-90"
        >
          <RyogoIcon color="black" size="sm" icon={ChevronRight} thick />
        </div>

        <RyogoSmall weight="font-bold">{question}</RyogoSmall>
      </summary>
      <RyogoSmall color="slate">{answer}</RyogoSmall>
    </details>
  )
}
