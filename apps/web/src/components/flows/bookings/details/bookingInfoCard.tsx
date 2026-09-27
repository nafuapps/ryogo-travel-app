import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
  DateWrapper,
  DetailsBorderWrapper,
  DetailsHeaderWrapper,
} from "@/components/page/pageWrappers"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"
import { RyogoCaption } from "@/components/typography"
import { ClockPlus } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"

export default async function BookingCreationInfoCard({
  name,
  createdAt,
  photoUrl,
}: {
  name: string
  createdAt: Date
  photoUrl: string | null
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  return (
    <DetailsBorderWrapper>
      <DetailsHeaderWrapper>
        <RyogoCaption color="light">{t("Created")}</RyogoCaption>
      </DetailsHeaderWrapper>
      <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 items-center justify-center">
        <DateWrapper date={createdAt} />
        <SectionColWrapper small className="w-full">
          <SectionRowWrapper className="items-center justify-start">
            <RyogoEnclosedIcon icon={ClockPlus} size="sm" color="slate" />
            <RyogoCaption color="light">
              {moment(createdAt).format("hh:mm a")}
            </RyogoCaption>
          </SectionRowWrapper>
          <RyogoImageIconTag url={photoUrl} label={name} />
        </SectionColWrapper>
      </div>
    </DetailsBorderWrapper>
  )
}
