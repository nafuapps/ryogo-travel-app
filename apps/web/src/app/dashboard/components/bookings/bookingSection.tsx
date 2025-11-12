import { SmallBold } from "@/components/typography"

type BookingSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
export default function BookingSection(props: BookingSectionType) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{props.sectionTitle}</SmallBold>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 lg:gap-4 items-center">
        {props.children}
      </div>
    </div>
  )
}
