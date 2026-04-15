import {
  Bell,
  Car,
  DollarSign,
  LucideProps,
  MapPin,
  MessageSquare,
  Plus,
  Send,
  Tickets,
  UserPlus,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { ForwardRefExoticComponent, RefAttributes } from "react"

export type CommandType = {
  label: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
  action: (term?: string) => void
}

export default function useCommandCenter(): CommandType[] {
  const path = usePathname()
  const router = useRouter()

  if (path === "/dashboard")
    return [
      {
        label: "Booking Details",
        icon: Tickets,
        action: (id) => {
          router.push(`/dashboard/bookings/${id}`)
        },
      },
      { label: "Log Advance", icon: DollarSign, action: () => {} },
      { label: "Assign Driver", icon: UserPlus, action: () => {} },
    ]

  if (path === "/dashboard/bookings")
    return [
      { label: "Share Quote", icon: Send, action: () => {} },
      { label: "Log Advance", icon: DollarSign, action: () => {} },
      { label: "Assign Driver", icon: UserPlus, action: () => {} },
    ]

  if (path === "/dashboard/drivers")
    return [
      { label: "Broadcast Duty", icon: MessageSquare, action: () => {} },
      { label: "Check Location", icon: MapPin, action: () => {} },
      { label: "Add Driver", icon: Plus, action: () => {} },
    ]

  // Default Dashboard Actions
  return [
    {
      label: "New Booking",
      icon: Plus,
      action: () => {
        router.push("/dashboard/bookings/new")
      },
    },
    { label: "Doc Alerts", icon: Bell, action: () => {} },
    { label: "Fleet Status", icon: Car, action: () => {} },
  ]
}
