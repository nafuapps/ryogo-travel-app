import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { RyogoP, RyogoCaption } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"
import Link from "next/link"

export default function BookingCustomerCard({
  customer,
  withLink,
  hidePhone,
}: {
  customer: NonNullable<NonNullable<FindBookingDetailsByIdType>["customer"]>
  withLink?: boolean
  hidePhone?: boolean
}) {
  if (withLink) {
    return (
      <Link
        href={`/dashboard/customers/${customer.id}`}
        className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
      >
        <CustomerCard customer={customer} />
      </Link>
    )
  }
  return <CustomerCard customer={customer} hidePhone={hidePhone} />
}

function CustomerCard({
  customer,
  hidePhone,
}: {
  customer: NonNullable<NonNullable<FindBookingDetailsByIdType>["customer"]>
  hidePhone?: boolean
}) {
  return (
    <SectionRowWrapper className="p-2 lg:p-3 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg items-center">
      {customer.photoUrl ? (
        <RyogoImage
          src={getFileUrl(customer.photoUrl)}
          alt={customer.name}
          imageSize="md"
        />
      ) : (
        <RyogoEnclosedIcon icon={User} size="lg" />
      )}
      <SectionColWrapper small className="w-full">
        <RyogoP weight="font-bold">{customer.name}</RyogoP>
        {!hidePhone && (
          <RyogoCaption color="slate">{customer.phone}</RyogoCaption>
        )}
        <RyogoCaption color="light">
          {customer.location.city + ", " + customer.location.state}
        </RyogoCaption>
      </SectionColWrapper>
    </SectionRowWrapper>
  )
}
