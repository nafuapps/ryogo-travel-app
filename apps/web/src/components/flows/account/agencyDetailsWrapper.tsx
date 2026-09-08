import { AgencyStatusPill } from "@/components/pills/ryogoPills"
import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  AccountDetailsBorderWrapper,
  AccountDetailsContentWrapper,
  AccountIDWrapper,
  AccountLineItem,
} from "./accountCommon"

export default async function AgencyDetailsWrapper({
  id,
  phone,
  email,
  address,
  commission,
  createdAt,
  status,
  isRider,
}: {
  id: string
  phone: string
  email: string
  address: string
  commission: number
  createdAt: Date
  status: AgencyStatusEnum
  isRider?: boolean
}) {
  const t = await getTranslations("Dashboard.AccountAgency")
  return (
    <AccountDetailsBorderWrapper>
      <AccountIDWrapper id={id} label={t("AgencyId")} />
      <AccountDetailsContentWrapper>
        <AccountLineItem label={t("Phone")} value={phone} />
        <AccountLineItem label={t("Email")} value={email} />
        <AccountLineItem label={t("Address")} value={address} />
        {!isRider && (
          <AccountLineItem label={t("Commission")} value={commission + "%"} />
        )}
        <AccountLineItem
          label={t("Joined")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <AgencyStatusPill status={status} />
      </AccountDetailsContentWrapper>
    </AccountDetailsBorderWrapper>
  )
}
