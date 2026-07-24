import {
  FindSupportTicketsByAgencyIdType,
  FindSupportTicketsByUserIdType,
} from "@ryogo-travel-app/api/services/support.services"

export default function SupportTicketsPageComponent({
  isOwner,
  tickets,
}: {
  isOwner: boolean
  tickets: FindSupportTicketsByAgencyIdType | FindSupportTicketsByUserIdType
}) {
  return <div></div>
}
