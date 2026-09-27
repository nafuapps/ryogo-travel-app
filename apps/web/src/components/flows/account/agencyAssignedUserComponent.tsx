import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import {
  SectionWrapper,
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsHeaderWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import RyogoImageIconTag from "@/components/tags/ryogoImageIconTag"

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
          <RyogoImageIconTag url={photoUrl} label={name} />
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
