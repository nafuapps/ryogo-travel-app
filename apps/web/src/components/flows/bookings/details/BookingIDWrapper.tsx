import { SectionRowWrapper } from "@/components/page/pageWrappers"
import IdCopyPill from "@/components/pills/idCopyPill"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default function BookingIDWrapper({
  id,
  status,
}: {
  id: string
  status: BookingStatusEnum
}) {
  return (
    <SectionRowWrapper className="items-center w-full justify-between">
      <BookingStatusPill status={status} size="lg" />
      <IdCopyPill id={id} />
    </SectionRowWrapper>
  )
}
