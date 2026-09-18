import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
} from "@/components/page/pageWrappers"

export default async function AgencyDetailsComponent({
  phone,
  email,
  address,
  commission,
  createdAt,
  isRider,
}: {
  phone: string
  email: string
  address: string
  commission: number
  createdAt: Date
  isRider?: boolean
}) {
  const t = await getTranslations("Dashboard.AccountAgency")
  return (
    <DetailsBorderWrapper>
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
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
