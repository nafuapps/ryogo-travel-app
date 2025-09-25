import { Caption, H5, SmallGrey } from "@/components/typography";
import { LucideChevronRight } from "lucide-react";
import Link from "next/link";

interface AccountCardProps {
  phone: string;
  userId: string;
  name: string;
  userRole: string;
  agencyName: string;
}
export const AccountCard = (props: AccountCardProps) => {
  return (
    <Link href={`/login/password?user=${props.userId}&phone=${props.phone}`}>
      <div className="flex flex-row gap-2 lg:gap-3 w-full justify-between shadow rounded-md p-4 lg:p-5">
        <div className="flex flex-col justify-between gap-2 lg:gap-3 items-start">
          <H5>{props.name}</H5>
          <SmallGrey>{props.agencyName}</SmallGrey>
        </div>
        <div className="flex flex-col justify-between gap-3 lg:gap-4 items-end">
          <div className="flex rounded-full bg-slate-100 px-2 py-1 lg:px-3 lg:py-2">
            <Caption>{props.userRole.toUpperCase()}</Caption>
          </div>
          <LucideChevronRight className="h-6 w-6 lg:h-10 lg:w-10" />
        </div>
      </div>
    </Link>
  );
};
