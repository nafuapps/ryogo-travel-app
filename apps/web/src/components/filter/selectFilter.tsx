import { SectionColWrapper } from "@/components/page/pageWrappers"
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
  label: string
  enumList: string[]
  value: string
  onValueChange: (value: string) => void
  disabled: boolean
}) {
  return (
    <SectionColWrapper small>
      <RyogoCaption color="light">{label}</RyogoCaption>
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value={"All"}>{"All"}</SelectItem>
            {Object.values(enumList).map((x) => {
              return <SelectItem value={x}>{x}</SelectItem>
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </SectionColWrapper>
  )
}
