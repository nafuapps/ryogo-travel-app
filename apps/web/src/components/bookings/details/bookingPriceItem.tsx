import { RyogoCaption, RyogoP } from "@/components/typography"

type BookingPriceItemType = {
  title: string
  value: string
  subtitle?: string
}
export default function BookingPriceItem(props: BookingPriceItemType) {
  return (
    <div className="flex flex-row justify-between items-center gap-2 lg:gap-3">
      <RyogoCaption color="light">{props.title}</RyogoCaption>
      <div className="flex flex-col gap-0.5 lg:gap-1 text-end">
        <RyogoP>{props.value}</RyogoP>
        {props.subtitle && (
          <RyogoCaption color="light">{props.subtitle}</RyogoCaption>
        )}
      </div>
    </div>
  )
}
