import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SelectFilter({
  label,
  enumList,
  value,
  onValueChange,
  disabled,
}: {
  enumList: string[]
  value: string
  onValueChange: (value: string) => void
  disabled: boolean
  label?: string
}) {
  if (!label) {
    return (
      <SectionRowWrapper small>
        <SelectFilterItem
          enumList={enumList}
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
        />
      </SectionRowWrapper>
    )
  }
  return (
    <SectionColWrapper small>
      <RyogoCaption color="light">{label}</RyogoCaption>
      <SelectFilterItem
        enumList={enumList}
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      />
    </SectionColWrapper>
  )
}

function SelectFilterItem({
  enumList,
  value,
  onValueChange,
  disabled,
}: {
  enumList: string[]
  value: string
  onValueChange: (value: string) => void
  disabled: boolean
}) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value={"All"}>{"All"}</SelectItem>
          {Object.values(enumList).map((x) => {
            return (
              <SelectItem key={x} value={x}>
                {x}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
