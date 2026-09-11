import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
  DateWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ClockPlus, User } from "lucide-react"
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
    <div className="flex flex-col border rounded-md">
      <div className="rounded-t-md p-2 lg:p-3 bg-slate-100 dark:bg-slate-800 flex justify-center items-center">
        <RyogoCaption color="light">{t("Created")}</RyogoCaption>
      </div>
      <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 items-center justify-center">
        <DateWrapper date={createdAt} />
        <SectionColWrapper wFull small>
          <SectionRowWrapper center justifyStart>
            <RyogoEnclosedIcon icon={ClockPlus} size="sm" color="slate" />
            <RyogoCaption color="light">
              {moment(createdAt).format("hh:mm a")}
            </RyogoCaption>
          </SectionRowWrapper>
          <SectionRowWrapper center justifyStart>
            {photoUrl ? (
              <RyogoImage
                src={getFileUrl(photoUrl)}
                alt={name}
                imageSize="xs"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="sm" />
            )}
            <RyogoCaption color="light">{name}</RyogoCaption>
          </SectionRowWrapper>
        </SectionColWrapper>
      </div>
    </div>
  )
}
