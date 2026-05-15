import { generateSubscriptionInvoiceName } from "@/lib/utils"
import { getFileUrl, uploadPDFBlob } from "@ryogo-travel-app/db/storage"
import getSubscriptionInvoicePDF from "@/components/pdf/generateSubscriptionInvoicePDF"
import sendEmail from "./sendEmail"
import { userServices } from "@ryogo-travel-app/api/services/user.services"
import { agencyServices } from "@ryogo-travel-app/api/services/agency.services"
import { orderServices } from "@ryogo-travel-app/api/services/order.services"
import { SubscriptionInvoiceEmailTemplate } from "./subscriptionInvoiceEmailTemplate"

export default async function generateAndsendInvoiceEmail(
  rpOrderId: string,
  agencyId: string,
  userId: string,
) {
  const userDetails = await userServices.findUserDetailsById(userId)
  const agencyDetails = await agencyServices.findAgencyById(agencyId)
  const orderDetails = await orderServices.findOrderByRPId(rpOrderId)
  if (!userDetails || !agencyDetails || !orderDetails) return

  // Generate invoice pdf
  const invoiceFile = await getSubscriptionInvoicePDF()
  const invoiceName = generateSubscriptionInvoiceName(agencyId, orderDetails.id)
  //Upload invoice file and get storage url
  const invoiceUrl = (await uploadPDFBlob(invoiceFile, invoiceName)).path

  const invoicePublicUrl = getFileUrl(invoiceUrl)

  //Send invoice email to the user (payer)
  const emailSent = await sendEmail(
    [userDetails.email],
    "RyoGo Subscription Invoice",
    SubscriptionInvoiceEmailTemplate({
      name: userDetails.name,
      agencyName: agencyDetails.businessName,
      ryogoInvoiceUrl: invoicePublicUrl,
      orderType: orderDetails.orderType,
      subscriptionPlan: agencyDetails.subscriptionPlan,
      expiryTime: agencyDetails.subscriptionExpiresOn,
    }),
    [{ filename: invoiceName, path: invoicePublicUrl }],
  )

  await orderServices.addInvoiceUrlAndEmailSentTime(
    orderDetails.id,
    invoiceUrl,
    emailSent.data ? new Date() : null,
  )
}
