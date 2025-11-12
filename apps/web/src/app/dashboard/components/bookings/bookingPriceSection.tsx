import { SmallBold } from "@/components/typography"

type BookingPriceSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
export default function BookingPriceSection(props: BookingPriceSectionType) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{props.sectionTitle}</SmallBold>
      <div className="grid grid-cols-1 gap-3 lg:gap-4 items-center">
        {props.children}
      </div>
    </div>
  )
}
