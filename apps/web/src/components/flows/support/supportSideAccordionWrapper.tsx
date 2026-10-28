"use client"

import { useEffect, useRef, useState } from "react"
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
  const t = useTranslations("Components.SupportAccordion")
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const accordionItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)")
    const updateScreenSize = () => setIsLargeScreen(mediaQuery.matches)

    updateScreenSize()
    mediaQuery.addEventListener("change", updateScreenSize)

    return () => mediaQuery.removeEventListener("change", updateScreenSize)
  }, [])
  const labelString = t(label)

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
                block: "start",
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
