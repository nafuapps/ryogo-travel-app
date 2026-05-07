import { FindCustomerDetailsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/customerDetailHeaderTabs"
import {
  RyogoCaption,
  RyogoH3,
  RyogoP,
  RyogoSmall,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { Separator } from "@/components/ui/separator"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Star, User } from "lucide-react"
import moment from "moment"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateCustomerAlertButton from "@/components/buttons/inactivateCustomerAlertButton"
import ActivateCustomerAlertButton from "@/components/buttons/activateCustomerAlertButton"
import ChangeCustomerPhotoSheet from "@/components/sheets/changeCustomerPhotoSheet"
import { CustomerStatusPill } from "@/components/statusPills/statusPills"
import { ContentWrapper, PageWrapper } from "@/components/page/pageWrappers"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default async function CustomerDetailsPageComponent({
  customer,
}: {
  customer: NonNullable<FindCustomerDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.CustomerDetails")

  return (
    <PageWrapper id="CustomerDetailsPage">
      <CustomerDetailHeaderTabs selectedTab={"Details"} id={customer.id} />
      <ContentWrapper id="CustomerDetailsInfo">
        <CustomerSection sectionTitle={t("BasicInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 justify-between">
            <div className="flex flex-col gap-2 lg:gap-3">
              {customer.photoUrl ? (
                <RyogoImage
                  src={getFileUrl(customer.photoUrl)}
                  alt={t("Photo")}
                  imageSize="lg"
                />
              ) : (
                <RyogoIcon icon={User} size="xl" />
              )}
              <ChangeCustomerPhotoSheet
                customerId={customer.id}
                agencyId={customer.agencyId}
              />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <RyogoH3>{customer.name}</RyogoH3>
              <RyogoCaption color="slate">{customer.phone}</RyogoCaption>
              <RyogoCaption color="slate">{customer.email}</RyogoCaption>
              <RyogoCaption color="slate">
                {moment(customer.createdAt).format("DD MMM YYYY")}
              </RyogoCaption>
              {customer.driverRatings && customer.driverRatings.length > 1 && (
                <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
                  <RyogoIcon icon={Star} size="sm" />
                  <RyogoP weight="font-bold">
                    {(
                      customer.driverRatings.reduce((a, c) => a + c, 0) /
                      customer.driverRatings.length
                    ).toFixed(1)}
                  </RyogoP>
                  <RyogoSmall color="slate">
                    {t("NumberRatings", {
                      number: customer.driverRatings.length,
                    })}
                  </RyogoSmall>
                </div>
              )}
              <CustomerStatusPill status={customer.status} />
            </div>
          </div>
        </CustomerSection>
        <Separator />
        <CustomerSection sectionTitle={t("AgencyInfo")}>
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <RyogoCaption color="slate">{customer.address}</RyogoCaption>
            <RyogoP weight="font-bold">
              {customer.location.city + ", " + customer.location.state}
            </RyogoP>
            <RyogoCaption color="slate">
              {customer.addedByUser.name}
            </RyogoCaption>
            <RyogoCaption color="light">{customer.remarks}</RyogoCaption>
          </div>
        </CustomerSection>
        <Separator />
        <div id="CustomerActions" className="flex flex-col gap-2 lg:gap-3">
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
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

type CustomerSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
function CustomerSection(props: CustomerSectionType) {
  return (
    <div id={props.sectionTitle} className="flex flex-col gap-2 lg:gap-3">
      <RyogoSmall weight="font-bold">{props.sectionTitle}</RyogoSmall>
      {props.children}
    </div>
  )
}
