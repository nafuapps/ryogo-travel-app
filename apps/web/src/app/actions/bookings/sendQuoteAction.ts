"use server"

import getLeadQuotePDF from "@/components/pdf/getLeadQuotePDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { getCurrentUser, verifyCurrentUser } from "@/lib/auth"
import { generateBookingQuotePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { getFileUrl, uploadFile } from "@ryogo-travel-app/db/storage"
import { format } from "date-fns"
import { getTranslations } from "next-intl/server"

export async function sendQuoteAction({
  bookingId,
  agencyId,
  assignedUserId,
}: {
  bookingId: string
  agencyId: string
  assignedUserId: string
}) {
  const currentUser = await getCurrentUser()
  if (
    !currentUser ||
    (currentUser.userRole !== UserRolesEnum.OWNER &&
      assignedUserId !== currentUser.userId) ||
    currentUser.agencyId !== agencyId
  ) {
    return
  }

  if (!(await verifyCurrentUser())) {
    return
  }

  //Get lead booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails) return

  let quoteUrl = bookingDetails.quoteUrl

  if (!quoteUrl) {
    //If no url, generate quote pdf file
    const quoteFile = await getLeadQuotePDF(bookingDetails)

    //Upload file and get storage url
    quoteUrl = (
      await uploadFile(quoteFile, generateBookingQuotePathName(bookingId))
    ).path
    if (!quoteUrl) return

    //Update quote url in DB
    await bookingServices.addQuoteUrl({ bookingId, quoteUrl })
  } else {
    //Else, just update quote sent time in DB
    await bookingServices.changeQuoteSent(bookingId)
  }

  //Send quote pdf to customer over whatsapp
  const t = await getTranslations("Dashboard.Whatsapp")
  const message = t("Quote", {
    customerName: bookingDetails.customer.name,
    bookingId: bookingDetails.id,
    source: bookingDetails.source.city,
    destination: bookingDetails.destination.city,
    startDate: format(bookingDetails.startDate, "dd MMM"),
    amount: bookingDetails.estimatedTotalAmount.toString(),
    agencyPhone: bookingDetails.assignedUser.phone,
    quoteLink: getFileUrl(quoteUrl),
  })
  const quoteMessage = getWhatsappMessageLink(
    bookingDetails.customer.phone,
    message,
  )

  return quoteMessage
}
