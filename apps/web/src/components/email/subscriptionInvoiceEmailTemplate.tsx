import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"
import {
  OrderTypeEnum,
  SubscriptionPlanEnum,
} from "@ryogo-travel-app/db/schema"

export function SubscriptionInvoiceEmailTemplate({
  name,
  agencyName,
  ryogoInvoiceUrl,
  orderType,
  subscriptionPlan,
  expiryTime,
}: {
  name: string
  agencyName: string
  ryogoInvoiceUrl: string
  orderType: OrderTypeEnum
  subscriptionPlan: SubscriptionPlanEnum
  expiryTime: Date
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h5>
        Thank you for purchasing <b>${orderType}</b> RyoGo subscription for your
        agency <b>${agencyName}</b>. You are now subscribed to our
        <b>${subscriptionPlan}</b> plan which will be valid till
        <b>{expiryTime.toLocaleDateString()}</b>.
      </h5>
      <p>
        Please find the detailed invoice attached with this email. Or you can
        download it here: {ryogoInvoiceUrl}
      </p>
      <p>
        For any issues, contact our support team at {SUPPORT_EMAIL} or call us
        at {SUPPORT_HELPLINE_NUMBER}
      </p>
      <small>
        This is an automatically generated email. Please do not reply.
      </small>
    </div>
  )
}
