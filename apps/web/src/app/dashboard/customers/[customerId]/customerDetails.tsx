import { FindCustomerDetailsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import {
  RyogoCaption,
  RyogoH3,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import moment from "moment"
import Link from "next/link"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateCustomerAlertButton from "@/components/buttons/alert/inactivateCustomerAlertButton"
import ActivateCustomerAlertButton from "@/components/buttons/alert/activateCustomerAlertButton"
import ChangeCustomerPhotoSheet from "@/components/sheets/changeCustomerPhotoSheet"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import RyogoAverageRatingDisplay from "@/components/ratings/ryogoRatingDisplay"
import CopyClipboardButton from "@/components/buttons/copy/copyClipboardButton"
import { Separator } from "@/components/ui/separator"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"

export default async function CustomerDetailsPageComponent({
  customer,
}: {
  customer: NonNullable<FindCustomerDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.CustomerDetails")

  return (
    <PageWrapper id="CustomerDetailsPage">
      <CustomerDetailHeaderTabs selectedTab={"Customer"} id={customer.id} />
      <SectionWrapper id="CustomerDetailsInfo">
        <SectionRowWrapper justifyStart>
          <RyogoH3 color="brand">{customer.id}</RyogoH3>
          <CopyClipboardButton label={customer.id} />
        </SectionRowWrapper>
        <Separator />
        <SectionRowWrapper>
          <SectionColWrapper>
            {customer.photoUrl ? (
              <RyogoImage
                src={getFileUrl(customer.photoUrl)}
                alt={t("Photo")}
                imageSize="lg"
              />
            ) : (
              <RyogoEnclosedIcon icon={User} size="xl" />
            )}
            <ChangeCustomerPhotoSheet
              customerId={customer.id}
              agencyId={customer.agencyId}
            />
          </SectionColWrapper>
          <SectionColWrapper end>
            <RyogoH3>{customer.name}</RyogoH3>
            <RyogoCaption color="slate">{customer.phone}</RyogoCaption>
            {customer.email && (
              <RyogoCaption color="slate">{customer.email}</RyogoCaption>
            )}
            <RyogoCaption color="slate">
              {moment(customer.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            {customer.driverRatings && customer.driverRatings.length > 1 && (
              <RyogoAverageRatingDisplay
                label={t("NumberRatings", {
                  number: customer.driverRatings.length,
                })}
                ratings={customer.driverRatings}
              />
            )}
            <CustomerStatusPill status={customer.status} />
          </SectionColWrapper>
        </SectionRowWrapper>
      </SectionWrapper>
      <SectionWrapper id={"CustomerAgencyInfo"}>
        <RyogoSmall weight="font-bold">{t("AgencyInfo")}</RyogoSmall>
        <SectionColWrapper>
          <RyogoCaption color="slate">{customer.address}</RyogoCaption>
          <RyogoP weight="font-bold">
            {customer.location.city + ", " + customer.location.state}
          </RyogoP>
          <RyogoCaption color="slate">{customer.addedByUser.name}</RyogoCaption>
          <RyogoCaption color="light">{customer.remarks}</RyogoCaption>
        </SectionColWrapper>
      </SectionWrapper>
      <SectionWrapper id={"CustomerActions"}>
        {customer.status === CustomerStatusEnum.ACTIVE && (
          <Link href={`/dashboard/bookings/new/${customer.id}`}>
            <RyogoDefaultButton className="w-full" label={t("CreateBooking")} />
          </Link>
        )}
        <Link href={`/dashboard/customers/${customer.id}/modify`}>
          <RyogoOutlineButton className="w-full" label={t("EditDetails")} />
        </Link>
        {customer.status !== CustomerStatusEnum.INACTIVE && (
          <InactivateCustomerAlertButton
            customerId={customer.id}
            agencyId={customer.agencyId}
          />
        )}
        {customer.status === CustomerStatusEnum.INACTIVE && (
          <ActivateCustomerAlertButton
            customerId={customer.id}
            agencyId={customer.agencyId}
          />
        )}
      </SectionWrapper>
    </PageWrapper>
  )
}
