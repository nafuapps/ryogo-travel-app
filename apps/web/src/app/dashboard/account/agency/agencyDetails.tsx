import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { Building2, MailPen, Phone } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PageWrapper, GridWrapper } from "@/components/page/pageWrappers"
import ActivateAgencyAlertButton from "@/components/buttons/alert/activateAgencyAlertButton"
import InactivateAgencyAlertButton from "@/components/buttons/alert/inactivateAgencyAlertButton"
import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import AgencyInfoWrapper from "@/components/flows/account/agencyInfoWrapper"
import AgencyDetailsWrapper from "@/components/flows/account/agencyDetailsWrapper"
import AgencyQRCodeWrapper from "@/components/flows/account/agencyQRCodeWrapper"

export default async function AgencyDetailsPageComponent({
  agency,
  isOwner,
}: {
  agency: NonNullable<FindAgencyByIdType>
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.AccountAgency")

  return (
    <PageWrapper id="AccountAgencyPage">
      <AccountDetailHeaderTabs selectedTab="Agency" />
      <GridWrapper id="AgencyDetails">
        <AgencyInfoWrapper
          id={agency.id}
          logoUrl={agency.logoUrl}
          agencyName={agency.businessName}
          city={agency.location.city}
          state={agency.location.state}
          isOwner={isOwner}
        />
        <AgencyDetailsWrapper
          id={agency.id}
          status={agency.status}
          address={agency.businessAddress}
          email={agency.businessEmail}
          phone={agency.businessPhone}
          commission={agency.defaultCommissionRate}
          createdAt={agency.createdAt}
        />
      </GridWrapper>
      {(isOwner || agency.qrCodeUrl) && (
        <AgencyQRCodeWrapper
          agencyId={agency.id}
          qrCodeUrl={agency.qrCodeUrl}
          isOwner={isOwner}
        />
      )}
      {isOwner && (
        <GridWrapper id="AgencyActions">
          <Link href="/dashboard/account/agency/modify">
            <RyogoDetailedIconButton
              label={t("Edit.Title")}
              icon={Building2}
              subtitle={t("Edit.Subtitle")}
            />
          </Link>
          <Link href={`/dashboard/account/agency/change-email`}>
            <RyogoDetailedIconButton
              label={t("ChangeEmail.Title")}
              icon={MailPen}
              subtitle={t("ChangeEmail.Subtitle")}
            />
          </Link>
          <Link href={`/dashboard/account/agency/change-phone`}>
            <RyogoDetailedIconButton
              label={t("ChangePhone.Title")}
              icon={Phone}
              subtitle={t("ChangePhone.Subtitle")}
            />
          </Link>
          {agency.status === AgencyStatusEnum.INACTIVE && (
            <ActivateAgencyAlertButton agencyId={agency.id} />
          )}
          {agency.status === AgencyStatusEnum.ACTIVE && (
            <InactivateAgencyAlertButton agencyId={agency.id} />
          )}
        </GridWrapper>
      )}
    </PageWrapper>
  )
}
