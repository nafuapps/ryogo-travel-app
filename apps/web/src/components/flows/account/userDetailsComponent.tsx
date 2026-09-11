import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsIDWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
} from "@/components/page/pageWrappers"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default async function UserDetailsComponent({
  phone,
  email,
  createdAt,
  role,
  id,
}: {
  phone: string
  email: string
  createdAt: Date
  role: UserRolesEnum
  id: string
}) {
  const t = await getTranslations("Dashboard.Account")
  return (
    <DetailsBorderWrapper>
      <DetailsIDWrapper id={id} label={t("UserId")} />
      <DetailsContentWrapper>
        <DetailsLineItem label={t("Phone")} value={phone} />
        <DetailsLineItem label={t("Email")} value={email} />
        <DetailsLineItem
          label={t("Joined")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <DetailsLineItem label={t("Role")} value={role.toUpperCase()} />
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
