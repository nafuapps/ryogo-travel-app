import { RyogoCaption, RyogoSmall } from "@/components/typography"

export default function BookingItem({
  title,
  value,
}: {
  title: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <RyogoCaption color="light">{title}</RyogoCaption>
      <RyogoSmall>{value}</RyogoSmall>
    </div>
  )
}
