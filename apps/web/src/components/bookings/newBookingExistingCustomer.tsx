import { H5, SmallGrey, CaptionGrey } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { UserCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import { RyogoImage } from "@/components/images/ryogoImage"
import { RyogoIcon } from "@/components/icons/RyogoIcon"

export default function ExistingCutomerCard({
  existingCustomer,
}: {
  existingCustomer: FindCustomersInAgencyType[number]
}) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step1")
  return (
    <div
      id="ExistingCustomer"
      className="flex flex-row gap-3 lg:gap-4 bg-white border-2 border-sky-700 rounded-lg p-3 lg:p-4"
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
      <div className="flex flex-col gap-0.5 lg:gap-1">
        <H5>{existingCustomer.name}</H5>
        <SmallGrey>{existingCustomer.remarks}</SmallGrey>
        <CaptionGrey>
          {existingCustomer.location.city +
            ", " +
            existingCustomer.location.state}
        </CaptionGrey>
      </div>
    </div>
  )
}
