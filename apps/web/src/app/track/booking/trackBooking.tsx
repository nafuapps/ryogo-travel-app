"use client"

import { findBookingAction } from "@/app/actions/bookings/findBookingAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import {
  PageWrapper,
  FormWrapper,
  FormContentWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH3, RyogoCaption } from "@/components/typography"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import z from "zod"

//A page to enter booking Id
export default function TrackBookingPageComponent() {
  const t = useTranslations("Track.TrackBooking")
  const router = useRouter()

  const trackBookingSchema = z.object({
    enteredId: z
      .string()
      .trim()
      .length(8, t("Field1.Error1"))
      .regex(/B\d{7}/, t("Field1.Error2")),
  })
  type TrackBookingType = z.infer<typeof trackBookingSchema>

  //Form init
  const form = useForm<TrackBookingType>({
    resolver: zodResolver(trackBookingSchema),
    defaultValues: {
      enteredId: "",
    },
  })

  //Form submit
  async function onSubmit(values: TrackBookingType) {
    const bookingId = await findBookingAction(values.enteredId)
    if (!bookingId) {
      form.setError("enteredId", {
        type: "manual",
        message: t("APIError"),
      })
      return
    } else {
      router.push(`/track/booking/${values.enteredId}`)
    }
  }
  return (
    <PageWrapper id="TrackBookingPage">
      <FormWrapper<TrackBookingType>
        form={form}
        onSubmit={form.handleSubmit(onSubmit)}
        id="newTransactionForm"
      >
        <RyogoH3>{t("Title")}</RyogoH3>
        <RyogoCaption color="slate">{t("Subtitle")}</RyogoCaption>
        <FormContentWrapper>
          <RyogoInput
            name="enteredId"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            type="text"
          />
        </FormContentWrapper>
        <StickyActionWrapper>
          <RyogoDefaultButton
            size={"lg"}
            label={form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
          />
          <RyogoOutlineButton
            size={"lg"}
            label={t("Clear")}
            type="button"
            onClick={() => form.reset()}
            disabled={form.formState.isSubmitting || !form.formState.isDirty}
          />
        </StickyActionWrapper>
      </FormWrapper>
    </PageWrapper>
  )
}
