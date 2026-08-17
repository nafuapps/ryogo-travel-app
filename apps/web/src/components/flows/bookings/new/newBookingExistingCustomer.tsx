import { RyogoH4, RyogoCaption } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { UserCheck, UserLock } from "lucide-react"
import { useTranslations } from "next-intl"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { CustomerStatusEnum } from "@ryogo-travel-app/db/schema"
import { CustomerStatusPill } from "@/components/pills/ryogoPills"

export default function ExistingCutomerCard({
  existingCustomer,
}: {
  existingCustomer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step1")
  const customerStatus = existingCustomer.status
  return (
    <div
      id="ExistingCustomer"
      className={`flex items-center gap-3 lg:gap-4 bg-white dark:bg-slate-900 border ${customerStatus === CustomerStatusEnum.INACTIVE ? "border-yellow-700 dark:border-yellow-200" : "border-sky-700 dark:border-sky-200"} rounded-lg p-3 lg:p-4`}
    >
      {existingCustomer.photoUrl ? (
        <RyogoImage
          src={getFileUrl(existingCustomer.photoUrl)}
          alt={t("Photo") + " " + existingCustomer.id}
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
        <RyogoCaption color="light">
          {existingCustomer.location.city +
            ", " +
            existingCustomer.location.state}
        </RyogoCaption>
        <RyogoCaption color="slate">{existingCustomer.remarks}</RyogoCaption>
      </SectionColWrapper>
      <CustomerStatusPill status={customerStatus} />
    </div>
  )
}
