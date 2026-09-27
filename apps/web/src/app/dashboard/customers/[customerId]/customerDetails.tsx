import { FindCustomerDetailsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import CustomerDetailHeaderTabs from "@/components/header/detailHeaderTabs/customerDetailHeaderTabs"
import { getTranslations } from "next-intl/server"
import { CalendarPlus, Camera, SquarePen } from "lucide-react"
import Link from "next/link"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import InactivateCustomerAlertButton from "@/components/buttons/alert/inactivateCustomerAlertButton"
import ActivateCustomerAlertButton from "@/components/buttons/alert/activateCustomerAlertButton"
import ChangeCustomerPhotoSheet from "@/components/sheets/changeCustomerPhotoSheet"
import {
  PageWrapper,
  GridWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import CustomerInfoComponent from "@/components/flows/customers/details/customerInfoComponent"
import CustomerDetailsComponent from "@/components/flows/customers/details/customerDetailsComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"

export default async function CustomerDetailsPageComponent({
  customer,
  userId,
  isOwner,
}: {
  customer: NonNullable<FindCustomerDetailsByIdType>
  userId: string
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.CustomerDetails")

  const canChangeDetails = customer.addedByUserId === userId || isOwner

  return (
    <PageWrapper id="CustomerDetailsPage">
      <CustomerDetailHeaderTabs selectedTab={"Customer"} id={customer.id} />
      <GridWrapper id="CustomerDetails">
        <CustomerInfoComponent
          id={customer.id}
          agencyId={customer.agencyId}
          photoUrl={customer.photoUrl}
          name={customer.name}
          status={customer.status}
          city={customer.location.city}
          state={customer.location.state}
          canChange={canChangeDetails}
        />
        <CustomerDetailsComponent
          createdAt={customer.createdAt}
          phone={customer.phone}
          email={customer.email}
          address={customer.address}
          remarks={customer.remarks}
          ratings={customer.driverRatings}
        />
      </GridWrapper>
      {canChangeDetails && (
        <GridWrapper id={"CustomerActions"}>
          {customer.status === CustomerStatusEnum.ACTIVE && (
            <Link href={`/dashboard/bookings/new/${customer.id}`}>
              <RyogoDetailedIconButton
                label={t("CreateBooking.Title")}
                icon={CalendarPlus}
                subtitle={t("CreateBooking.Subtitle")}
              />
            </Link>
          )}
          <ChangeCustomerPhotoSheet
            customerId={customer.id}
            agencyId={customer.agencyId}
            canChange
          >
            <RyogoDetailedIconButton
              icon={Camera}
              label={t("ChangeCustomerPhoto.Title")}
              subtitle={t("ChangeCustomerPhoto.Subtitle")}
            />
          </ChangeCustomerPhotoSheet>
          <Link href={`/dashboard/customers/${customer.id}/modify`}>
            <RyogoDetailedIconButton
              label={t("EditDetails.Title")}
              icon={SquarePen}
              subtitle={t("EditDetails.Subtitle")}
            />
          </Link>
          {customer.status !== CustomerStatusEnum.INACTIVE ? (
            <InactivateCustomerAlertButton
              customerId={customer.id}
              agencyId={customer.agencyId}
            />
          ) : (
            <ActivateCustomerAlertButton
              customerId={customer.id}
              agencyId={customer.agencyId}
            />
          )}
        </GridWrapper>
      )}
      <StickyActionWrapper>
        <HelpIconButton
          href={"/dashboard/support/help-customers"}
          showLabelSmall
        />
      </StickyActionWrapper>
    </PageWrapper>
  )
}
