import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { AtSign, Building2, MailPen, Phone, QrCode } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { PageWrapper, GridWrapper } from "@/components/page/pageWrappers"
import ActivateAgencyAlertButton from "@/components/buttons/alert/activateAgencyAlertButton"
import InactivateAgencyAlertButton from "@/components/buttons/alert/inactivateAgencyAlertButton"
import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import AgencyInfoComponent from "@/components/flows/account/agencyInfoComponent"
import AgencyDetailsComponent from "@/components/flows/account/agencyDetailsComponent"
import AgencyQRCodeComponent from "@/components/flows/account/agencyQRCodeComponent"
import ChangeAgencyLogoSheet from "@/components/sheets/changeAgencyLogoSheet"
import ChangeQRCodeSheet from "@/components/sheets/changeQRCodeSheet"

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
        <AgencyInfoComponent
          id={agency.id}
          logoUrl={agency.logoUrl}
          agencyName={agency.businessName}
          city={agency.location.city}
          state={agency.location.state}
          status={agency.status}
          canChange={isOwner}
        />
        <AgencyDetailsComponent
          address={agency.businessAddress}
          email={agency.businessEmail}
          phone={agency.businessPhone}
          commission={agency.defaultCommissionRate}
          createdAt={agency.createdAt}
        />
      </GridWrapper>
      <AgencyQRCodeComponent
        agencyId={agency.id}
        qrCodeUrl={agency.qrCodeUrl}
        canChange={isOwner}
      />
      {isOwner && (
        <GridWrapper id="AgencyActions">
          <ChangeAgencyLogoSheet agencyId={agency.id} canChange>
            <RyogoDetailedIconButton
              label={t("ChangeLogo.Title")}
              icon={AtSign}
              subtitle={t("ChangeLogo.Subtitle")}
            />
          </ChangeAgencyLogoSheet>
          <ChangeQRCodeSheet agencyId={agency.id} canChange>
            <RyogoDetailedIconButton
              icon={QrCode}
              label={
                agency.qrCodeUrl === null
                  ? t("ChangeQRCode.UploadTitle")
                  : t("ChangeQRCode.ChangeTitle")
              }
              subtitle={t("ChangeQRCode.Subtitle")}
            />
          </ChangeQRCodeSheet>
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
          <Link href="/dashboard/account/agency/modify">
            <RyogoDetailedIconButton
              label={t("Edit.Title")}
              icon={Building2}
              subtitle={t("Edit.Subtitle")}
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
