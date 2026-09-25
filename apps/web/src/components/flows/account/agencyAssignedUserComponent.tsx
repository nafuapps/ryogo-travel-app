import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import {
  SectionRowWrapper,
  SectionWrapper,
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"

export default async function AgencyAssignedUserComponent({
  name,
  phone,
  photoUrl,
}: {
  name: string
  phone: string
  photoUrl: string | null
}) {
  const t = await getTranslations("Rider.MyProfileAgency")
  return (
    <SectionWrapper id="AssignedUserInfo">
      <DetailsBorderWrapper>
        <DetailsHeaderWrapper>
          <RyogoCaption color="light" className="text-center">
            {t("AssignedUserInfo")}
          </RyogoCaption>
        </DetailsHeaderWrapper>
        <DetailsContentWrapper>
          <SectionRowWrapper className="items-center justify-start">
            {photoUrl ? (
              <RyogoImage
                src={getFileUrl(photoUrl)}
                alt={photoUrl}
                imageSize="xs"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="sm" />
            )}
            <RyogoCaption color={"slate"} className="text-center">
              {name}
            </RyogoCaption>
          </SectionRowWrapper>
        </DetailsContentWrapper>
      </DetailsBorderWrapper>
      <RyogoPhoneButton phone={phone} label={t("CallAgent")} />
      <RyogoChatButton
        phone={phone}
        label={t("ChatAgent.Title")}
        subtitle={t("ChatAgent.Subtitle")}
      />
    </SectionWrapper>
  )
}
