import { AgencyStatusPill } from "@/components/pills/ryogoPills"
import AccountDetailHeaderTabs from "@/components/header/detailHeaderTabs/accountDetailHeaderTabs"
import { RyogoH3, RyogoCaption, RyogoSmall } from "@/components/typography"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Building, Building2, MailPen, Phone } from "lucide-react"
import moment from "moment"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
  GridWrapper,
} from "@/components/page/pageWrappers"
import { RyogoDialogImage, RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import ChangeAgencyLogoSheet from "@/components/sheets/changeAgencyLogoSheet"
import ChangeQRCodeSheet from "@/components/sheets/changeQRCodeSheet"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { Separator } from "@/components/ui/separator"
import ActivateAgencyAlertButton from "@/components/buttons/alert/activateAgencyAlertButton"
import InactivateAgencyAlertButton from "@/components/buttons/alert/inactivateAgencyAlertButton"
import { AgencyStatusEnum } from "@ryogo-travel-app/db/schema"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"

export default async function AgencyDetailsPageComponent({
  agency,
  isOwner,
  userId,
}: {
  agency: NonNullable<FindAgencyByIdType>
  isOwner: boolean
  userId: string
}) {
  const t = await getTranslations("Dashboard.AccountAgency")

  return (
    <PageWrapper id="AccountAgencyPage">
      <AccountDetailHeaderTabs selectedTab="Agency" />
      <SectionWrapper id="BasicInfo">
        <SectionRowWrapper justifyStart>
          <RyogoH3 color="brand">{agency.id}</RyogoH3>
          <CopyClipboardButton label={agency.id} />
        </SectionRowWrapper>
        <Separator />
        <SectionRowWrapper>
          <SectionColWrapper>
            {agency.logoUrl ? (
              <RyogoImage
                src={getFileUrl(agency.logoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoEnclosedIcon icon={Building} size="xl" />
            )}
            {isOwner && (
              <ChangeAgencyLogoSheet agencyId={agency.id} userId={userId} />
            )}
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{agency.businessName}</RyogoH3>
            <RyogoCaption color="slate">{agency.businessPhone}</RyogoCaption>
            <RyogoCaption color="slate">{agency.businessEmail}</RyogoCaption>
            <RyogoCaption color="slate">{agency.businessAddress}</RyogoCaption>
            <RyogoCaption color="slate">
              {agency.location.city + ", " + agency.location.state}
            </RyogoCaption>
            <RyogoCaption color="slate">
              {moment(agency.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            {isOwner && <AgencyStatusPill status={agency.status} />}
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      {(isOwner || agency.qrCodeUrl) && (
        <SectionWrapper id="QRCodeSection">
          <RyogoSmall weight="font-bold">{t("QRCode")}</RyogoSmall>
          <SectionColWrapper center>
            {agency.qrCodeUrl && (
              <RyogoDialogImage
                src={getFileUrl(agency.qrCodeUrl)}
                alt={t("QRCode")}
                imageSize="lg"
              />
            )}
            {isOwner && (
              <ChangeQRCodeSheet
                agencyId={agency.id}
                userId={userId}
                newPhoto={agency.qrCodeUrl ? false : true}
              />
            )}
          </SectionColWrapper>
        </SectionWrapper>
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
