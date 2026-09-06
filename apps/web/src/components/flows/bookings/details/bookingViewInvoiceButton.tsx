import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import BookingInvoicePDFViewer from "@/components/pdf/bookingInvoicePDFViewer"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { Eye } from "lucide-react"
import { getTranslations } from "next-intl/server"

export default async function BookingViewInvoiceButton({
  bookingDetails,
}: {
  bookingDetails: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = await getTranslations("Dashboard.BookingDetails")
  return (
    <Dialog>
      <DialogTrigger asChild>
        <RyogoOutlineButton label={t("ViewInvoice")}>
          <RyogoIcon icon={Eye} size="sm" color="slate" />
        </RyogoOutlineButton>
      </DialogTrigger>
      <DialogContent className="size-5/6 p-4 lg:p-5">
        <BookingInvoicePDFViewer booking={bookingDetails} />
      </DialogContent>
    </Dialog>
  )
}
