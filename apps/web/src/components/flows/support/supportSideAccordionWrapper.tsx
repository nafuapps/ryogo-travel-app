"use client"

import { SectionWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function SupportSideAccordionWrapper({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  const isLargeScreen = window.innerWidth >= 1024

  return (
    <SectionWrapper id={label}>
      <Accordion
        type="single"
        collapsible
        defaultValue={isLargeScreen ? label : undefined}
      >
        <AccordionItem value={label}>
          <AccordionTrigger className="flex items-center justify-between gap-2.5 lg:gap-3 py-0">
            <RyogoCaption color="light">{label}</RyogoCaption>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col w-full pt-4 pb-0 gap-1.5 lg:gap-2">
            {children}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </SectionWrapper>
  )
}
