import { RyogoP, RyogoCaption, RyogoTiny } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import {
  ChevronRight,
  Star,
  User,
  Lock as LockIcon,
  MessageSquareQuote,
} from "lucide-react"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import Link from "next/link"
import { toast } from "sonner"
import { useTranslations } from "next-intl"
import RyogoAverageRatingDisplay from "@/components/ratings/ryogoRatingDisplay"

export default function ExistingCutomerCard({
  existingCustomer,
}: {
  existingCustomer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.NewBooking")
  const customerStatus = existingCustomer.status
  const isActive = customerStatus === CustomerStatusEnum.ACTIVE
  return (
    <Link
      aria-disabled={!isActive}
      onClick={(e) => {
        if (!isActive) {
          e.preventDefault()
          toast.warning(t("CustomerMustBeActive"))
        }
      }}
      href={`/dashboard/bookings/new/${existingCustomer.id}`}
      className={`flex items-center gap-3 lg:gap-4 border ${!isActive ? "hover:bg-yellow-50 hover:dark:bg-yellow-950 opacity-50 cursor-not-allowed" : "hover:bg-slate-100 dark:hover:bg-slate-800"} rounded-lg p-3 lg:p-4`}
    >
      <SectionColWrapper className="w-full">
        <SectionRowWrapper className="items-center justify-start">
          {existingCustomer.photoUrl ? (
            <RyogoImage
              src={getFileUrl(existingCustomer.photoUrl)}
              alt={existingCustomer.name}
              imageSize="md"
            />
          ) : (
            <RyogoEnclosedIcon icon={User} size="lg" color={"slate"} />
          )}
          <SectionColWrapper small className="w-full">
            <RyogoP weight="font-bold">{existingCustomer.name}</RyogoP>
            <RyogoCaption color="light" weight="font-bold">
              {existingCustomer.phone}
            </RyogoCaption>
            <RyogoTiny color="light">
              {existingCustomer.location.city +
                ", " +
                existingCustomer.location.state}
            </RyogoTiny>
          </SectionColWrapper>
        </SectionRowWrapper>
        {existingCustomer.remarks && (
          <SectionRowWrapper
            small
            className="items-center rounded bg-slate-100 dark:bg-slate-800 px-2 lg:px-3 py-1 lg:py-1.5"
          >
            <RyogoIcon size="xs" icon={MessageSquareQuote} color="light" />
            <RyogoTiny color="light">{existingCustomer.remarks}</RyogoTiny>
          </SectionRowWrapper>
        )}
      </SectionColWrapper>
      <SectionColWrapper className="items-end h-full justify-around">
        <CustomerStatusPill status={customerStatus} size="sm" />
        {existingCustomer.driverRatings &&
          existingCustomer.driverRatings.length > 0 && (
            <RyogoAverageRatingDisplay
              ratings={existingCustomer.driverRatings}
            />
          )}
        <RyogoIcon
          icon={isActive ? ChevronRight : LockIcon}
          size="sm"
          color={isActive ? "slate" : "light"}
          thick={isActive}
        />
      </SectionColWrapper>
    </Link>
  )
}
