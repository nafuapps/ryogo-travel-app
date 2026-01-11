import { Caption, H5, SmallGrey } from "@/components/typography"
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
      <div className="flex flex-row gap-2 lg:gap-3 w-full justify-between shadow rounded-lg hover:bg-slate-100 p-4 lg:p-5">
        <div className="flex flex-col justify-between gap-2 lg:gap-3 items-start">
          <H5>{account.name}</H5>
          <SmallGrey>{account.agency.businessName}</SmallGrey>
        </div>
        <div className="flex flex-col justify-between gap-3 lg:gap-4 items-end">
          <div className="flex rounded-full bg-slate-200 px-2 py-1 lg:px-3 lg:py-2">
            <Caption>{account.userRole.toUpperCase()}</Caption>
          </div>
          <LucideChevronRight className="h-6 w-6 lg:h-10 lg:w-10" />
        </div>
      </div>
    </Link>
  )
}
