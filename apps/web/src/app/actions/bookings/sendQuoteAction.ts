"use server"

import { LeadBookingEmailTemplate } from "@/components/email/leadBookingEmailTemplate"
import sendEmail from "@/components/email/sendEmail"
import getLeadQuotePDF from "@/components/pdf/getLeadQuotePDF"
import getWhatsappMessageLink from "@/components/whatsapp/getWhatsappMessageLink"
import { writePermissions } from "@/lib/permissions"
import { generateBookingQuotePathName } from "@/lib/utils"
import { bookingServices } from "@ryogo-travel-app/api/services/booking.services"
import { BookingStatusEnum } from "@ryogo-travel-app/db/schema"
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
  const currentUser = await writePermissions.allowAssignedUserOrOwner({
    agencyId,
    assignedUserId,
  })
  if (!currentUser) {
    return
  }

  //Get lead booking details
  const bookingDetails = await bookingServices.findBookingDetailsById(bookingId)
  if (!bookingDetails || bookingDetails.status !== BookingStatusEnum.LEAD) {
    return
  }

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

  // Share quote over email to customer
  if (bookingDetails.customer.email) {
    await sendEmail({
      receipientEmail: [bookingDetails.customer.email],
      subject: "Booking Quotation | RyoGo",
      element: LeadBookingEmailTemplate({
        name: bookingDetails.customer.name,
        bookingId: bookingDetails.id,
        downloadUrl: getFileUrl(quoteUrl),
        route: `${bookingDetails.source.city} - ${bookingDetails.destination.city}`,
        date: format(bookingDetails.startDate, "dd MMM"),
      }),
    })
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
