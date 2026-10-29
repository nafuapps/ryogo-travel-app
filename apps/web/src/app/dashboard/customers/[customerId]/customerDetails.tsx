import ActivateCustomerAlertButton from "@/components/buttons/alert/activateCustomerAlertButton"
import InactivateCustomerAlertButton from "@/components/buttons/alert/inactivateCustomerAlertButton"
import RyogoChatButton from "@/components/buttons/chat/ryogoChatButton"
import RyogoPhoneButton from "@/components/buttons/phone/ryogoPhoneButton"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import CustomerDetailsComponent from "@/components/flows/customers/details/customerDetailsComponent"
import CustomerInfoComponent from "@/components/flows/customers/details/customerInfoComponent"
import { HelpIconButton } from "@/components/flows/support/helpButtons"
import {
  GridWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import ChangeCustomerPhotoSheet from "@/components/sheets/changeCustomerPhotoSheet"
import { FindCustomerDetailsByIdType } from "@ryogo-travel-app/api/services/customer.services"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import { CalendarPlus, Camera, SquarePen } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Link from "next/link"

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
      <GridWrapper id="CustomerActionsWrapper">
        <RyogoPhoneButton label={t("CallCustomer")} phone={customer.phone} />
        <RyogoChatButton
          label={t("ChatCustomer.Title")}
          phone={customer.phone}
          subtitle={t("ChatCustomer.Subtitle")}
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
