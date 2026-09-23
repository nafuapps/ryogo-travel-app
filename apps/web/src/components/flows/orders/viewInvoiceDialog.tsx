import SubscriptionInvoicePDFViewer from "@/components/pdf/subscriptionInvoicePDFViewer"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye } from "lucide-react"
import { FindAllOrdersByAgencyIdType } from "@ryogo-travel-app/api/services/order.services"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function ViewInvoiceDialog({
  order,
}: {
  order: FindAllOrdersByAgencyIdType[number]
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <RyogoOutlineButton>
          <RyogoIcon size="sm" icon={Eye} color="slate" />
        </RyogoOutlineButton>
      </DialogTrigger>
      <DialogContent className="size-5/6 overflow-scroll">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <SubscriptionInvoicePDFViewer order={order} />
      </DialogContent>
    </Dialog>
  )
}
