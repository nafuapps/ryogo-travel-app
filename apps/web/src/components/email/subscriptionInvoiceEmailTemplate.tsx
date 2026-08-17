import EmailFooter from "./emailFooter"

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
  orderType: string
  subscriptionPlan: string
  expiryTime: Date
}) {
  return (
    <div>
      <h1>Hello, {name}!</h1>
      <h5>
        Thank you for purchasing <b>{orderType}</b> RyoGo subscription for your
        agency <b>{agencyName}</b>. You are now subscribed to our
        <b>{subscriptionPlan}</b> plan which will be valid till
        <b>{expiryTime.toLocaleDateString()}</b>.
      </h5>
      <p>
        Please find the detailed invoice attached with this email. Or you can
        download it here: {ryogoInvoiceUrl}
      </p>
      <EmailFooter />
    </div>
  )
}
