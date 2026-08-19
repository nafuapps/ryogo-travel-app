import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption, RyogoSmall } from "@/components/typography"
import { ChevronRight } from "lucide-react"

export type SupportFAQItemType = {
  question: string
  answer: string
}

export function SupportFAQWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center divide-y items-center w-full bg-white dark:bg-slate-900 p-4 lg:p-5 rounded-lg shadow-xs">
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
    <details className="group flex flex-col gap-1 lg:gap-1.5 w-full px-1.5 lg:px-2 py-3 lg:py-4">
      <summary className="flex items-center gap-2 lg:gap-3">
        <RyogoEnclosedIcon
          size="sm"
          icon={ChevronRight}
          color="slate"
          bgColor="slate"
          className="transition group-open:rotate-90"
          thick
        />
        <RyogoSmall weight="font-bold">{question}</RyogoSmall>
      </summary>
      <RyogoCaption color="slate">{answer}</RyogoCaption>
    </details>
  )
}
