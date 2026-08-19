import SubscriptionInvoicePDFViewer from "@/components/pdf/subscriptionInvoicePDFViewer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default function ViewInvoiceDialog({
  order,
  agency,
}: {
  order: FindAllOrdersByAgencyIdType[number]
  agency: NonNullable<FindAgencyByIdType>
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <RyogoIcon size="sm" icon={Eye} color="slate" />
        </Button>
      </DialogTrigger>
      <DialogContent className="size-5/6 overflow-scroll">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SubscriptionInvoicePDFViewer order={order} agency={agency} />
      </DialogContent>
    </Dialog>
  )
}
