import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"

export default function BookingPriceItem({
  title,
  value,
  subtitle,
}: {
  title: string
  value: string
  subtitle?: string
}) {
  return (
    <SectionRowWrapper center>
      <RyogoCaption color="light">{title}</RyogoCaption>
      <SectionColWrapper end small>
        <RyogoP>{value}</RyogoP>
        {subtitle && <RyogoCaption color="light">{subtitle}</RyogoCaption>}
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
