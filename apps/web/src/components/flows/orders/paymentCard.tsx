import { SectionColWrapper } from "@/components/page/pageWrappers"
import { PaymentStatusPill } from "@/components/pills/ryogoPills"
import { RyogoCaption, RyogoP, RyogoTiny } from "@/components/typography"
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
    <div className="flex border p-3 lg:p-4 rounded-lg justify-between gap-2 lg:gap-3">
      <SectionColWrapper className="justify-between">
        <RyogoCaption color="light" weight="font-bold">
          {"Payment #" + payment.id}
        </RyogoCaption>
        <RyogoP color="slate" weight="font-bold">
          {payment.method}
        </RyogoP>
        <RyogoTiny color="light">
          {moment(payment.updatedAt).format("lll")}
        </RyogoTiny>
      </SectionColWrapper>
      <SectionColWrapper className="items-end justify-between">
        <PaymentStatusPill status={payment.status} />
        {payment.status === PaymentStatusEnum.FAILED &&
          payment.errorReason &&
          payment.errorSource && (
            <RyogoCaption color="red">
              {payment.errorReason + " (" + payment.errorSource + ")"}
            </RyogoCaption>
          )}
        {payment.bankName && (
          <RyogoCaption color="light">
            {payment.bankName.toUpperCase()}
          </RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.CARD && payment.cardId && (
          <RyogoCaption color="light">{payment.cardId}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.UPI && payment.vpa && (
          <RyogoCaption color="light">{payment.vpa}</RyogoCaption>
        )}
        {payment.method === PaymentMethodEnum.WALLET && payment.wallet && (
          <RyogoCaption color="light">
            {payment.wallet.toUpperCase()}
          </RyogoCaption>
        )}
      </SectionColWrapper>
    </div>
  )
}
