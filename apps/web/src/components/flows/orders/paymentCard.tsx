import { SectionColWrapper } from "@/components/page/pageWrappers"
import { PaymentStatusPill } from "@/components/pills/ryogoPills"
import { RyogoSmall, RyogoCaption } from "@/components/typography"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import {
  PaymentMethodEnum,
  PaymentStatusEnum,
} from "@ryogo-travel-app/db/schema"
import moment from "moment"

export default function PaymentCard({
  payment,
}: {
  payment: FindAllOrdersByAgencyIdType[number]["payments"][number]
}) {
  return (
    <div className="flex bg-slate-100 dark:bg-slate-800 p-3 lg:p-4 rounded-lg justify-between gap-2 lg:gap-3">
      <SectionColWrapper>
        <RyogoSmall color="brand" weight="font-bold">
          {"Payment #" + payment.id}
        </RyogoSmall>
        <PaymentStatusPill status={payment.status} />
        <RyogoCaption color="slate" weight="font-bold">
          {payment.method.toUpperCase()}
        </RyogoCaption>
      </SectionColWrapper>
      <SectionColWrapper end>
        <RyogoCaption color="slate">
          {moment(payment.updatedAt).format("DD MMM YYYY - hh:mm A")}
        </RyogoCaption>
        {payment.bankName && (
          <RyogoSmall>{payment.bankName.toUpperCase()}</RyogoSmall>
        )}
        {payment.method === PaymentMethodEnum.CARD && payment.cardId && (
          <RyogoCaption color="slate">{payment.cardId}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.UPI && payment.vpa && (
          <RyogoCaption color="slate">{payment.vpa}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.WALLET && payment.wallet && (
          <RyogoCaption color="slate">
            {payment.wallet.toUpperCase()}
          </RyogoCaption>
        )}
        {payment.status === PaymentStatusEnum.FAILED &&
          payment.errorReason &&
          payment.errorSource && (
            <RyogoCaption color="red">
              {payment.errorReason + " (" + payment.errorSource + ")"}
            </RyogoCaption>
          )}
      </SectionColWrapper>
    </div>
  )
}
