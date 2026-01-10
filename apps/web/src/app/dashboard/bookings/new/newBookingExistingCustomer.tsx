import { H5, SmallGrey, CaptionGrey } from "@/components/typography"
import { FindCustomersInAgencyType } from "@ryogo-travel-app/api/services/customer.services"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { LucideUserCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function ExistingCutomerCard({
  existingCustomer,
}: {
  existingCustomer: FindCustomersInAgencyType[number] | undefined
}) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step1")
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  useEffect(() => {
    if (existingCustomer?.photoUrl) {
      setPhotoUrl(getFileUrl(existingCustomer?.photoUrl))
    }
  }, [])
  console.log(photoUrl)
  return (
    <div
      id="ExistingCustomer"
      className="flex flex-row gap-3 lg:gap-4 bg-white border border-slate-100 rounded-lg p-3 lg:p-4"
    >
      {photoUrl ? (
        <div className="relative size-10 lg:size-12 rounded-lg overflow-hidden">
          <Image
            src={photoUrl}
            alt={t("Photo") + " " + existingCustomer?.id}
            fill
            sizes="(max-width: 768px) 24px,32px"
          />
        </div>
      ) : (
        <div className="flex rounded-lg size-10 lg:size-12 bg-slate-100 justify-center items-center">
          <LucideUserCheck className="text-slate-500 stroke-1 size-6 lg:size-7" />
        </div>
      )}
      <div className="flex flex-col gap-0.5 lg:gap-1 items-start">
        <H5>{existingCustomer?.name}</H5>
        <SmallGrey>{existingCustomer?.remarks}</SmallGrey>
        <CaptionGrey>{existingCustomer?.location}</CaptionGrey>
      </div>
    </div>
  )
}
