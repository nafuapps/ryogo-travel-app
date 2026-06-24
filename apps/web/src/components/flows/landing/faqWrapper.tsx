"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoP, RyogoSmall } from "@/components/typography"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export function FAQWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center divide-y items-center w-full max-w-4xl">
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
  const [open, setOpen] = useState(false)
  return (
    <div className="flex flex-col gap-3 lg:gap-4 w-full py-5 lg:py-6">
      <div
        className="flex items-center gap-2.5 lg:gap-3"
        onClick={() => setOpen(!open)}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition rounded-lg bg-slate-100 p-1.5 lg:p-2 ${
            open ? "" : "-rotate-90"
          }`}
        >
          <RyogoIcon color="black" size="sm" icon={ChevronDown} thick />
        </div>

        <RyogoP weight="font-bold">{question}</RyogoP>
      </div>
      {open && <RyogoSmall color="slate">{answer}</RyogoSmall>}
    </div>
  )
}
