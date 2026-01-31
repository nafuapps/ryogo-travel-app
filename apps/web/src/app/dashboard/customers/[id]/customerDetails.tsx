import { pageClassName } from "@/components/page/pageCommons"
import { FindCustomerDetailsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "./customerDetailHeaderTabs"
import {
  Caption,
  CaptionGrey,
  H4,
  PBold,
  SmallBold,
  SmallGrey,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideStar, LucideUser } from "lucide-react"
import moment from "moment"
import { getCustomerStatusColor } from "../../components/customers/customerCommon"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateCustomerAlertButton from "../../components/buttons/inactivateCustomerAlertButton"
import ActivateCustomerAlertButton from "../../components/buttons/activateCustomerAlertButton"
import ChangeCustomerPhotoSheet from "./changeCustomerPhotoSheet"

export default async function CustomerDetailsPageComponent({
  customer,
}: {
  customer: NonNullable<FindCustomerDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.CustomerDetails")

  const bgColor = getCustomerStatusColor(customer.status)

  return (
    <div id="CustomerDetailsPage" className={pageClassName}>
      <CustomerDetailHeaderTabs selectedTab={"Details"} id={customer.id} />
      <div
        id="CustomerDetailsInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <CustomerSection sectionTitle={t("BasicInfo")}>
          <div className="flex flex-row gap-3 lg:gap-4 items-start justify-between">
            <div className="flex flex-col gap-2 lg:gap-3 items-start">
              {customer.photoUrl ? (
                <div className="relative size-28 lg:size-32 rounded-lg overflow-hidden">
                  <Image
                    src={getFileUrl(customer.photoUrl)}
                    alt={t("Photo")}
                    fill
                    sizes="(max-width: 768px) 112px,128px"
                  />
                </div>
              ) : (
                <LucideUser className="size-20 lg:size-24 text-slate-400" />
              )}
              <ChangeCustomerPhotoSheet customerId={customer.id} />
            </div>
            <div className="flex flex-col gap-2 lg:gap-3 items-end">
              <H4>{customer.name}</H4>
              <Caption>{customer.phone}</Caption>
              <Caption>{customer.email}</Caption>
              <Caption>
                {moment(customer.createdAt).format("DD MMM YYYY")}
              </Caption>
              {customer.driverRatings && customer.driverRatings.length > 1 && (
                <div className="flex flex-row gap-1 lg:gap-1.5 items-center justify-center">
                  <LucideStar className="text-slate-900 size-5 lg:size-6" />
                  <PBold>
                    {(
                      customer.driverRatings.reduce((a, c) => a + c, 0) /
                      customer.driverRatings.length
                    ).toFixed(1)}
                  </PBold>
                  <SmallGrey>
                    {t("NumberRatings", {
                      number: customer.driverRatings.length,
                    })}
                  </SmallGrey>
                </div>
              )}
              <div
                className={`flex items-center justify-center ${bgColor} rounded-full gap-1 lg:gap-1.5 px-3 py-1.5 lg:px-6 lg:py-2`}
              >
                <Caption>{customer.status.toUpperCase()}</Caption>
              </div>
            </div>
          </div>
        </CustomerSection>
        <Separator />
        <CustomerSection sectionTitle={t("AgencyInfo")}>
          <div className="flex flex-col gap-1 lg:gap-1.5">
            <Caption>{customer.address}</Caption>
            <PBold>
              {customer.location.city + ", " + customer.location.state}
            </PBold>
            <Caption>{customer.addedByUser.name}</Caption>
            <CaptionGrey>{customer.remarks}</CaptionGrey>
          </div>
        </CustomerSection>
        <Separator />
        <div id="CustomerActions" className="flex flex-col gap-2 lg:gap-3">
          <Link href={`/dashboard/customers/${customer.id}/modify`}>
            <Button variant={"outline"} className="w-full">
              {t("EditDetails")}
            </Button>
          </Link>
          {customer.status != CustomerStatusEnum.INACTIVE && (
            <InactivateCustomerAlertButton customerId={customer.id} />
          )}
          {customer.status == CustomerStatusEnum.INACTIVE && (
            <ActivateCustomerAlertButton customerId={customer.id} />
          )}
        </div>
      </div>
    </div>
  )
}

type CustomerSectionType = {
  sectionTitle: string
  children: React.ReactNode
}
function CustomerSection(props: CustomerSectionType) {
  return (
    <div id={props.sectionTitle} className="flex flex-col gap-2 lg:gap-3">
      <SmallBold>{props.sectionTitle}</SmallBold>
      {props.children}
    </div>
  )
}
