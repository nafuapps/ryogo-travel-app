import { CaptionGrey, P } from "@/components/typography"

type BookingItemType = {
  title: string
  value: string
}
export default function BookingItem(props: BookingItemType) {
  return (
    <div className="flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start gap-2 sm:gap-0.5 lg:gap-1 last:text-end sm:last:text-start">
      <CaptionGrey>{props.title}</CaptionGrey>
      <P>{props.value}</P>
    </div>
  )
}
