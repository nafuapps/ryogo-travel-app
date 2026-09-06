import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { BookingStatusPill } from "@/components/pills/ryogoPills"
import { RyogoP } from "@/components/typography"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"

export default function BookingIDWrapper({
  id,
  status,
}: {
  id: string
  status: BookingStatusEnum
}) {
  return (
    <SectionRowWrapper center wFull>
      <SectionRowWrapper center justifyStart>
        <CopyClipboardButton label={id} />
        <RyogoP color="brand" weight="font-bold">
          {id}
        </RyogoP>
      </SectionRowWrapper>
      <BookingStatusPill status={status} />
    </SectionRowWrapper>
  )
}
