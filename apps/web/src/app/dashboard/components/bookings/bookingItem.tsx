import { CaptionGrey, P } from "@/components/typography"

type BookingItemType = {
  title: string
  value: string
}
export default function BookingItem(props: BookingItemType) {
  return (
    <div className="flex flex-col gap-0.5">
      <CaptionGrey>{props.title}</CaptionGrey>
      <P>{props.value}</P>
    </div>
  )
}
