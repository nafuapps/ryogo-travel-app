import { CaptionGrey, SmallBold } from "@/components/typography"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { LucideChevronRight } from "lucide-react"
import Link from "next/link"
import { getFileUrl } from "@ryogo-travel-app/db/storage"
import { RyogoImage } from "@/components/images/ryogoImage"

export const AccountCard = ({
  account,
}: {
  account: FindUserAccountsByPhoneType[number]
}) => {
  return (
    <Link href={`/auth/login/password/${account.id}`}>
      <div className="flex flex-row gap-2 lg:gap-3 w-full justify-between border border-slate-100 rounded-lg hover:bg-slate-50 p-3 lg:p-4">
        <div className="flex flex-col justify-between gap-1 lg:gap-2">
          <div className="flex items-center gap-2 lg:gap-3">
            {account.photoUrl && (
              <RyogoImage
                src={getFileUrl(account.photoUrl)}
                alt={"Account Photo"}
                imageSize="xs"
              />
            )}
            <SmallBold>{account.name}</SmallBold>
          </div>
          <CaptionGrey>{account.agency.businessName}</CaptionGrey>
        </div>
        <div className="flex flex-col justify-between gap-2 lg:gap-3 items-end">
          <div className="flex rounded-full bg-slate-200 px-2 py-1 lg:px-2.5 lg:py-1.5">
            <CaptionGrey>{account.userRole.toUpperCase()}</CaptionGrey>
          </div>
          <LucideChevronRight className="size-4 md:size-5" />
        </div>
      </div>
    </Link>
  )
}
