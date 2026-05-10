import { RyogoH4, RyogoSmall, RyogoCaption } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { UserCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"

export default function ExistingCutomerCard({
  existingCustomer,
}: {
  existingCustomer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step1")
  return (
    <div
      id="ExistingCustomer"
      className="flex flex-row gap-3 lg:gap-4 bg-white border border-sky-700 rounded-lg p-3 lg:p-4"
    >
      {existingCustomer.photoUrl ? (
        <RyogoImage
          src={getFileUrl(existingCustomer.photoUrl)}
          alt={t("Photo") + " " + existingCustomer.id}
          imageSize="sm"
        />
      ) : (
        <div className="flex rounded-lg size-10 lg:size-12 bg-slate-100 justify-center items-center">
          <RyogoIcon icon={UserCheck} size="md" />
        </div>
      )}
      <SectionColWrapper small>
        <RyogoH4>{existingCustomer.name}</RyogoH4>
        <RyogoSmall color="slate">{existingCustomer.remarks}</RyogoSmall>
        <RyogoCaption color="light">
          {existingCustomer.location.city +
            ", " +
            existingCustomer.location.state}
        </RyogoCaption>
      </SectionColWrapper>
    </div>
  )
}
