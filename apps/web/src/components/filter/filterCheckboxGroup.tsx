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

export default function FilterCheckboxGroup<V extends string>({
  enumValueDisplayPairs,
  title,
  selectedFilters,
  setSelectedFilters,
}: {
  title: string
  selectedFilters: V[]
  setSelectedFilters: (filters: V[]) => void
  enumValueDisplayPairs: {
    display: string
    value: V
  }[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <SectionWrapper id="FeedFilters">
      <FieldSet className="gap-4">
        <SectionRowWrapper center onClick={() => setOpen(!open)}>
          <RyogoCaption color="light">{title}</RyogoCaption>
          <RyogoIcon
            icon={open ? ChevronUp : ChevronDown}
            size="sm"
            color="slate"
          />
        </SectionRowWrapper>
        <FieldGroup
          className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 ${open ? "" : "hidden"}`}
        >
          {enumValueDisplayPairs.map((pair) => (
            <Field
              orientation="horizontal"
              key={String(pair.value)}
              className="gap-1.5"
            >
              <Checkbox
                id={String(pair.value)}
                name={String(pair.value)}
                checked={selectedFilters.includes(pair.value)}
                onCheckedChange={() => {
                  const newFilters = selectedFilters.includes(pair.value)
                    ? selectedFilters.filter((v) => v !== pair.value)
                    : [...selectedFilters, pair.value]
                  setSelectedFilters(newFilters)
                }}
              />
              <RyogoCaption>{pair.display}</RyogoCaption>
            </Field>
          ))}
        </FieldGroup>
      </FieldSet>
    </SectionWrapper>
  )
}
