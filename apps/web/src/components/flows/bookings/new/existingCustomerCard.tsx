import { RyogoH4, RyogoCaption } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { Star, UserCheck, UserLock } from "lucide-react"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"
import { IconTextTag } from "@/components/tags/IconTextTag"
import { getAverageRating } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"
import { useTranslations } from "next-intl"

export default function ExistingCutomerCard({
  existingCustomer,
}: {
  existingCustomer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.NewBooking")
  const customerStatus = existingCustomer.status
  const isNotActive = customerStatus !== CustomerStatusEnum.ACTIVE
  return (
    <Link
      aria-disabled={isNotActive}
      onClick={(e) => {
        if (isNotActive) {
          e.preventDefault()
          toast.warning(t("CustomerMustBeActive"))
        }
      }}
      href={`/dashboard/bookings/new/${existingCustomer.id}`}
      className={`flex items-center gap-3 lg:gap-4 border ${isNotActive ? "hover:bg-yellow-50 hover:dark:bg-yellow-950" : "hover:bg-sky-50 dark:hover:bg-sky-950"} rounded-lg p-3 lg:p-4`}
    >
      {existingCustomer.photoUrl ? (
        <RyogoImage
          src={getFileUrl(existingCustomer.photoUrl)}
          alt={existingCustomer.name}
          imageSize="sm"
        />
      ) : customerStatus === CustomerStatusEnum.ACTIVE ? (
        <RyogoEnclosedIcon
          icon={UserCheck}
          size="md"
          color={"brand"}
          bgColor={"brand"}
        />
      ) : (
        <RyogoEnclosedIcon
          icon={UserLock}
          size="md"
          color={"yellow"}
          bgColor={"yellow"}
        />
      )}
      <SectionColWrapper small wFull>
        <RyogoH4>{existingCustomer.name}</RyogoH4>
        <RyogoCaption>{existingCustomer.phone}</RyogoCaption>
        <RyogoCaption color="light">
          {existingCustomer.location.city +
            ", " +
            existingCustomer.location.state}
        </RyogoCaption>
        <RyogoCaption color="slate">{existingCustomer.remarks}</RyogoCaption>
        {existingCustomer.driverRatings &&
          existingCustomer.driverRatings.length > 0 && (
            <IconTextTag
              icon={Star}
              text={getAverageRating(existingCustomer.driverRatings)}
            />
          )}
      </SectionColWrapper>
      <CustomerStatusPill status={customerStatus} />
    </Link>
  )
}
