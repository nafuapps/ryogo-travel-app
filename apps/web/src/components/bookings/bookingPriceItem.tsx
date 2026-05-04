import { CaptionGrey, P } from "@/components/typography"

type BookingPriceItemType = {
  title: string
  value: string
  subtitle?: string
}
export default function BookingPriceItem(props: BookingPriceItemType) {
  return (
    <div className="flex flex-row justify-between items-center gap-2 lg:gap-3">
      <CaptionGrey>{props.title}</CaptionGrey>
      <div className="flex flex-col gap-0.5 lg:gap-1 text-end">
        <P>{props.value}</P>
        {props.subtitle && <CaptionGrey>{props.subtitle}</CaptionGrey>}
      </div>
    </div>
  )
}
