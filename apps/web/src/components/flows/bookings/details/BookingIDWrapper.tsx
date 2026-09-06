import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoP } from "@/components/typography"

export default function BookingIDWrapper({ id }: { id: string }) {
  return (
    <SectionRowWrapper center>
      <RyogoP color="brand" weight="font-bold">
        {id}
      </RyogoP>
      <CopyClipboardButton label={id} />
    </SectionRowWrapper>
  )
}
