import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { RyogoImage } from "@/components/images/ryogoImage"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { RyogoP, RyogoCaption } from "@/components/typography"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { User } from "lucide-react"

export default function BookingCustomerCard({
  customer,
}: {
  customer: NonNullable<NonNullable<FindBookingDetailsByIdType>["customer"]>
}) {
  return (
    <div className="flex gap-2 lg:gap-3 p-2 lg:p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg items-center">
      {customer.photoUrl ? (
        <RyogoImage
          src={getFileUrl(customer.photoUrl)}
          alt={customer.name}
          imageSize="md"
        />
      ) : (
        <RyogoEnclosedIcon icon={User} size="lg" />
      )}
      <SectionColWrapper wFull small>
        <RyogoP weight="font-bold">{customer.name}</RyogoP>
        <RyogoCaption color="slate">{customer.phone}</RyogoCaption>
        <RyogoCaption color="light">
          {customer.location.city + ", " + customer.location.state}
        </RyogoCaption>
      </SectionColWrapper>
    </div>
  )
}
