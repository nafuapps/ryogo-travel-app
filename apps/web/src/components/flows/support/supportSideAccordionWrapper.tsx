"use client"

import { useRef } from "react"
import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { useTranslations } from "next-intl"

export default function SupportSideAccordionWrapper({
  label,
  children,
}: {
  label: "TableOfContent" | "QuickActions" | "RelatedArticles" | "SocialMedia"
  children: React.ReactNode
}) {
  const isLargeScreen = window.innerWidth >= 1024
  const labelString = useTranslations("SupportAccordion")(label)
  const accordionItemRef = useRef<HTMLDivElement>(null)

  return (
    <SectionWrapper id={label}>
      <Accordion
        type="single"
        collapsible
        defaultValue={isLargeScreen ? label : undefined}
        onValueChange={(value) => {
          if (value === label) {
            setTimeout(() => {
              accordionItemRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
              })
            }, 200)
          }
        }}
      >
        <AccordionItem ref={accordionItemRef} value={label}>
          <AccordionTrigger className="flex items-center justify-between gap-2.5 lg:gap-3 py-0">
            <RyogoCaption color="light">{labelString}</RyogoCaption>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col w-full pt-4 pb-0 gap-1.5 lg:gap-2">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SectionWrapper>
  )
}
