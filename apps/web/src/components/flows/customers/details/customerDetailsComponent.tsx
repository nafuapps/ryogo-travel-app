import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
  DetailsLineWrapper,
} from "@/components/page/pageWrappers"
import moment from "moment"
import RyogoAverageRatingDisplay from "@/components/ratings/ryogoRatingDisplay"

export default async function CustomerDetailsComponent({
  createdAt,
  phone,
  email,
  address,
  ratings,
  remarks,
}: {
  createdAt: Date
  phone: string
  email: string | null
  address: string | null
  ratings: number[] | null
  remarks: string | null
}) {
  const t = await getTranslations("Dashboard.CustomerDetails")
  return (
    <DetailsBorderWrapper>
      <DetailsContentWrapper>
        <DetailsLineItem
          label={t("Added")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />

        <DetailsLineItem label={t("Phone")} value={phone} />
        {email && <DetailsLineItem label={t("Email")} value={email} />}
        {address && <DetailsLineItem label={t("Address")} value={address} />}
        {remarks && <DetailsLineItem label={t("Remarks")} value={remarks} />}
        {ratings && (
          <DetailsLineWrapper label={t("Rating")}>
            <RyogoAverageRatingDisplay ratings={ratings} />
          </DetailsLineWrapper>
        )}
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
