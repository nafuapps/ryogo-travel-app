import { H5, SmallGrey, CaptionGrey } from "@/components/typography";
import { NewBookingFindCustomerAPIResponseType } from "@ryogo-travel-app/api/types/customer.types";
import { LucideUserCheck } from "lucide-react";

export default function ExistingCutomerCard({
  existingCustomer,
}: {
  existingCustomer: NewBookingFindCustomerAPIResponseType;
}) {
  return (
    <div
      id="ExistingCustomer"
      className="flex flex-row gap-3 lg:gap-4 bg-white border border-slate-100 rounded-lg p-3 lg:p-4"
    >
      <div className="flex rounded-full size-10 lg:size-12 bg-slate-100 justify-center items-center">
        <LucideUserCheck className="text-slate-500 stroke-1 size-6 lg:size-7" />
      </div>
      <div className="flex flex-col gap-0.5 lg:gap-1 items-start">
        <H5>{existingCustomer?.name}</H5>
        <SmallGrey>{existingCustomer?.remarks}</SmallGrey>
        <CaptionGrey>{existingCustomer?.location}</CaptionGrey>
      </div>
    </div>
  );
}
