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
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateCustomerAlertButton from "@/components/buttons/alert/inactivateCustomerAlertButton"
import ActivateCustomerAlertButton from "@/components/buttons/alert/activateCustomerAlertButton"
import ChangeCustomerPhotoSheet from "@/components/sheets/changeCustomerPhotoSheet"
import { CustomerStatusPill } from "@/components/statusPills/statusPills"
import {
  SectionWrapper,
  PageWrapper,
  SectionRowWrapper,
  SectionColWrapper,
} from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import RyogoRatingDisplay from "@/components/ratings/ryogoRatingDisplay"

export default async function CustomerDetailsPageComponent({
  customer,
}: {
  customer: NonNullable<FindCustomerDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.CustomerDetails")

  return (
    <PageWrapper id="CustomerDetailsPage">
      <CustomerDetailHeaderTabs selectedTab={"Details"} id={customer.id} />
      <SectionWrapper id="CustomerDetailsInfo">
        <RyogoSmall weight="font-bold">{t("BasicInfo")}</RyogoSmall>
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
            <RyogoCaption color="slate">{customer.email}</RyogoCaption>
            <RyogoCaption color="slate">
              {moment(customer.createdAt).format("DD MMM YYYY")}
            </RyogoCaption>
            {customer.driverRatings && customer.driverRatings.length > 1 && (
              <RyogoRatingDisplay
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
        <Link href={`/dashboard/customers/${customer.id}/modify`}>
          <Button variant={"outline"} className="w-full">
            {t("EditDetails")}
          </Button>
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
