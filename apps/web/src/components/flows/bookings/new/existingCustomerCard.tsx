import { RyogoH4, RyogoCaption } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { ChevronRight, Star, UserCheck, Lock as LockIcon } from "lucide-react"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon, RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
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
      className={`flex items-center gap-3 lg:gap-4 border ${isNotActive ? "hover:bg-yellow-50 hover:dark:bg-yellow-950 opacity-50" : "hover:bg-sky-50 dark:hover:bg-sky-950"} rounded-lg p-3 lg:p-4`}
    >
      <SectionColWrapper wFull>
        <SectionRowWrapper justifyStart center>
          {existingCustomer.photoUrl ? (
            <RyogoImage
              src={getFileUrl(existingCustomer.photoUrl)}
              alt={existingCustomer.name}
              imageSize="sm"
            />
          ) : (
            <RyogoEnclosedIcon
              icon={UserCheck}
              size="md"
              color={"slate"}
              bgColor={"slate"}
            />
          )}
          <SectionColWrapper small wFull>
            <RyogoH4>{existingCustomer.name}</RyogoH4>
            <RyogoCaption color="light" weight="font-bold">
              {existingCustomer.phone}
            </RyogoCaption>
          </SectionColWrapper>
        </SectionRowWrapper>
        <RyogoCaption color="light">
          {existingCustomer.location.city +
            ", " +
            existingCustomer.location.state}
        </RyogoCaption>
        {existingCustomer.remarks && (
          <RyogoCaption color="slate">{existingCustomer.remarks}</RyogoCaption>
        )}
        {existingCustomer.driverRatings &&
          existingCustomer.driverRatings.length > 0 && (
            <IconTextTag
              icon={Star}
              text={getAverageRating(existingCustomer.driverRatings)}
            />
          )}
      </SectionColWrapper>
      <SectionColWrapper end hFull justifyBetween>
        <CustomerStatusPill status={customerStatus} />
        <RyogoIcon
          icon={isNotActive ? LockIcon : ChevronRight}
          size="sm"
          color={isNotActive ? "light" : "slate"}
        />
      </SectionColWrapper>
    </Link>
  )
}
