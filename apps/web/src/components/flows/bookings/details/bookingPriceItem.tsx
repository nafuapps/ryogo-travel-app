import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoP } from "@/components/typography"

type BookingPriceItemType = {
  title: string
  value: string
  subtitle?: string
}
export default function BookingPriceItem(props: BookingPriceItemType) {
  return (
    <SectionRowWrapper center>
      <RyogoCaption color="light">{props.title}</RyogoCaption>
      <SectionColWrapper end small>
        <RyogoP>{props.value}</RyogoP>
        {props.subtitle && (
          <RyogoCaption color="light">{props.subtitle}</RyogoCaption>
        )}
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
