import { RyogoH4 } from "@/components/typography"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import { DriverStatusEnum } from "@ryogo-travel-app/db/schema"
import { DriverStatusPill } from "@/components/pills/ryogoPills"

export default function DriverInfoComponent({
  photoUrl,
  name,
  status,
}: {
  photoUrl: string | null
  name: string
  status: DriverStatusEnum
}) {
  return (
    <SectionColWrapper center>
      <SectionColWrapper center small>
        {photoUrl ? (
          <RyogoImage
            src={getFileUrl(photoUrl)}
            alt={photoUrl}
            imageSize="lg"
          />
        ) : (
          <RyogoEnclosedIcon icon={User} size="xl" />
        )}
      </SectionColWrapper>
      <SectionColWrapper center small>
        <RyogoH4 weight="font-bold">{name}</RyogoH4>
        <DriverStatusPill status={status} className="mt-auto self-center" />
      </SectionColWrapper>
    </SectionColWrapper>
  )
}
