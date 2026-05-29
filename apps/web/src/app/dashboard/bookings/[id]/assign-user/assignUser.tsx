"use client"

import { FindBookingDetailsByIdType } from "@ryogo-travel-app/api/services/booking.services"
import { FindOwnerAndAgentsByAgencyType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { useState, useTransition } from "react"
import AssignUserTile from "@/components/flows/bookings/assign/assignUserTile"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { assignUserAction } from "@/app/actions/bookings/assignUserAction"
import { toast } from "sonner"
import { RyogoSmall } from "@/components/typography"
import {
  SectionWrapper,
  PageWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import SubscriptionReminderButton from "@/components/flows/susbcription/subscriptionReminderButton"

export default function AssignUserPageComponent({
  bookingId,
  users,
  booking,
  limited,
  isSubscribed,
}: {
  bookingId: string
  users: FindOwnerAndAgentsByAgencyType
  booking: NonNullable<FindBookingDetailsByIdType>
  limited: boolean
  isSubscribed: boolean
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
        if (
          await assignUserAction(bookingId, selectedUserId, booking.agencyId)
        ) {
          toast.success(t("Success"))
          router.replace(`/dashboard/bookings/${bookingId}`)
        } else {
          toast.error(t("Error"))
        }
      })
    }
  }

  return (
    <PageWrapper id="AssignUserPage">
      {limited && (
        <SubscriptionReminderButton
          warningText={isSubscribed ? t("ExpiredWarning") : t("TrialWarning")}
          ctaText={isSubscribed ? t("RenewCTA") : t("BuyCTA")}
          isSubscribed={isSubscribed}
        />
      )}
      <SectionWrapper id="AssignUserInfo">
        <RyogoSmall weight="font-bold">{t("Title")}</RyogoSmall>
        {users.map((user, index) => (
          <AssignUserTile
            key={index}
            userData={user}
            booking={booking}
            selectedUserId={selectedUserId}
            setSelectedUserId={setSelectedUserId}
          />
        ))}
      </SectionWrapper>
      <StickyActionWrapper>
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
      </StickyActionWrapper>
    </PageWrapper>
  )
}
