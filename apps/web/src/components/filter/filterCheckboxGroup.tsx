import { useState } from "react"
import {
  SectionRowWrapper,
  SectionWrapper,
} from "@/components/page/pageWrappers"
import { Field, FieldGroup, FieldSet } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronUp, ChevronDown } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"

export default function FilterCheckboxGroup({
  title,
  selectedFilters,
  setSelectedFilters,
  allFilters,
}: {
  title: string
  selectedFilters: string[]
  setSelectedFilters: (filters: string[]) => void
  allFilters: string[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <SectionWrapper id="Filters">
      <FieldSet className="gap-4">
        <SectionRowWrapper
          className="items-center justify-between"
          onClick={() => setOpen(!open)}
        >
          <RyogoCaption color="light">{title}</RyogoCaption>
          <RyogoIcon
            icon={open ? ChevronUp : ChevronDown}
            size="sm"
            color="light"
            thick
          />
        </SectionRowWrapper>
        <FieldGroup
          className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 ${open ? "" : "hidden"}`}
        >
          {allFilters.map((item) => (
            <Field
              orientation="horizontal"
              key={String(item)}
              className="gap-1.5"
            >
              <Checkbox
                id={String(item)}
                name={String(item)}
                checked={selectedFilters.includes(item)}
                onCheckedChange={() => {
                  const newFilters = selectedFilters.includes(item)
                    ? selectedFilters.filter((v) => v !== item)
                    : [...selectedFilters, item]
                  setSelectedFilters(newFilters)
                }}
              />
              <RyogoCaption>{item}</RyogoCaption>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </SectionWrapper>
  )
}
