import { AgencyStatusPill } from "@/components/pills/ryogoPills"
import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsIDWrapper,
  DetailsLineItem,
} from "@/components/page/pageWrappers"

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
    <DetailsBorderWrapper>
      <DetailsIDWrapper id={id} label={t("AgencyId")} />
      <DetailsContentWrapper>
        <DetailsLineItem label={t("Phone")} value={phone} />
        <DetailsLineItem label={t("Email")} value={email} />
        <DetailsLineItem label={t("Address")} value={address} />
        {!isRider && (
          <DetailsLineItem label={t("Commission")} value={commission + "%"} />
        )}
        <DetailsLineItem
          label={t("Joined")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <AgencyStatusPill status={status} />
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
