"use client"

import { pageClassName } from "@/components/page/pageCommons"
import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindOwnerAndAgentsByAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignUserTile from "./assignUserTile"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { assignUserAction } from "@/app/actions/assignUserAction"
import { toast } from "sonner"
import { SmallBold } from "@/components/typography"

export default function AssignUserPageComponent({
  bookingId,
  users,
  booking,
}: {
  bookingId: string
  users: FindOwnerAndAgentsByAgencyType
  booking: NonNullable<FindBookingDetailsByIdType>
}) {
  const t = useTranslations("Dashboard.AssignUser")
  const router = useRouter()

  const [isPending, startTransition] = useTransition()

  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    booking.assignedUserId,
  )

  const canAssignUser =
    selectedUserId && selectedUserId !== booking.assignedUserId

  const handleAssignUser = async () => {
    if (selectedUserId) {
      startTransition(async () => {
        if (await assignUserAction(bookingId, selectedUserId)) {
          toast.success(t("Success"))
          router.replace(`/dashboard/bookings/${bookingId}`)
        } else {
          toast.error(t("Error"))
        }
      })
    }
  }

  return (
    <div id="AssignUserPage" className={pageClassName}>
      <div
        id="AssignUserInfo"
        className="flex flex-col gap-3 lg:gap-4 w-full bg-white rounded-lg p-4 lg:p-5"
      >
        <SmallBold>{t("Title")}</SmallBold>
        {users.map((user, index) => (
          <AssignUserTile
            key={index}
            userData={user}
            booking={booking}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
        ))}
        <Button
          variant={"default"}
          size={"lg"}
          onClick={handleAssignUser}
          disabled={!canAssignUser}
        >
          {isPending && <Spinner />}
          {isPending ? t("Loading") : t("PrimaryCTA")}
        </Button>
        <Button
          variant={"outline"}
          size={"lg"}
          type="button"
          onClick={() => router.back()}
          disabled={isPending}
        >
          {t("CancelCTA")}
        </Button>
      </div>
    </div>
  )
}
