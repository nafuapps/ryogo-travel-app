import { UserStatusPill } from "@/components/pills/ryogoPills"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsIDWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
} from "@/components/page/pageWrappers"

export default async function UserDetailsWrapper({
  phone,
  email,
  createdAt,
  status,
  id,
}: {
  phone: string
  email: string
  createdAt: Date
  status: UserStatusEnum
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
        <UserStatusPill status={status} className="mt-auto" />
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
