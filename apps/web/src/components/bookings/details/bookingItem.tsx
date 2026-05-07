import { RyogoCaption, RyogoSmall } from "@/components/typography"

type BookingItemType = {
  title: string
  value: string
}
export default function BookingItem(props: BookingItemType) {
  return (
    <div className="flex flex-col gap-0.5">
      <RyogoCaption color="light">{props.title}</RyogoCaption>
      <RyogoSmall>{props.value}</RyogoSmall>
    </div>
  )
}
