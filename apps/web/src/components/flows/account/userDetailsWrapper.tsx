import { UserStatusPill } from "@/components/pills/ryogoPills"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  AccountDetailsBorderWrapper,
  AccountDetailsContentWrapper,
  AccountIDWrapper,
  AccountLineItem,
} from "./accountCommon"

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
    <AccountDetailsBorderWrapper>
      <AccountIDWrapper id={id} label={t("UserId")} />
      <AccountDetailsContentWrapper>
        <AccountLineItem label={t("Phone")} value={phone} />
        <AccountLineItem label={t("Email")} value={email} />
        <AccountLineItem
          label={t("Joined")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <UserStatusPill status={status} />
      </AccountDetailsContentWrapper>
    </AccountDetailsBorderWrapper>
  )
}
