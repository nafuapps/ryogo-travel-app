import { CaptionGrey, PBold } from "@/components/typography"
import { FindUserAccountsByPhoneType } from "@ryogo-travel-app/api/services/user.services"
import { LucideChevronRight } from "lucide-react"
import Link from "next/link"

export const AccountCard = ({
  account,
}: {
  account: FindUserAccountsByPhoneType[number]
}) => {
  return (
    <Link href={`/auth/login/password/${account.id}`}>
      <div className="flex flex-row gap-2 lg:gap-3 w-full justify-between border border-slate-100 rounded-lg hover:bg-slate-50 p-4 lg:p-5">
        <div className="flex flex-col justify-between gap-1 lg:gap-2 items-start">
          <PBold>{account.name}</PBold>
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
