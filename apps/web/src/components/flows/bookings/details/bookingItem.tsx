import { RyogoCaption, RyogoSmall } from "@/components/typography"

export default function BookingItem(props: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <RyogoCaption color="light">{props.title}</RyogoCaption>
      <RyogoSmall>{props.value}</RyogoSmall>
    </div>
  )
}
