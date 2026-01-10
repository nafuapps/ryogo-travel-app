import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form } from "@/components/ui/form"
import { NewVehicleFormDataType } from "./newVehicleForm"
import { Button } from "@/components/ui/button"
import {
  DashboardInput,
  DashboardSwitch,
} from "@/components/form/dashboardFormFields"
import { H4, CaptionGrey, SmallGrey } from "@/components/typography"
import {
  newBookingSectionClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingFormClassName,
} from "../../bookings/new/newBookingCommon"
import NewBookingStepsTracker from "../../bookings/new/newBookingStepsTracker"

export function NewVehicleStep4(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: NewVehicleFormDataType
  setNewVehicleFormData: Dispatch<SetStateAction<NewVehicleFormDataType>>
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step4")
  const step4Schema = z.object({
    defaultRatePerKm: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(0, t("Field1.Error2"))
      .max(50, t("Field1.Error3"))
      .nonnegative(t("Field1.Error4"))
      .multipleOf(1, t("Field1.Error5"))
      .optional(),
    hasAC: z.boolean(),
    defaultAcChargePerDay: z.coerce
      .number<number>()
      .min(0, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .nonnegative(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5"))
      .optional(),
  })
  type Step4Type = z.infer<typeof step4Schema>
  const formData = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      defaultRatePerKm: props.newVehicleFormData.defaultRatePerKm,
      hasAC: props.newVehicleFormData.hasAC,
      defaultAcChargePerDay: props.newVehicleFormData.defaultAcChargePerDay,
    },
  })

  //Submit actions
  const onSubmit = (data: Step4Type) => {
    props.setNewVehicleFormData({
      ...props.newVehicleFormData,
      defaultRatePerKm: data.defaultRatePerKm,
      hasAC: data.hasAC,
      defaultAcChargePerDay: data.defaultAcChargePerDay,
    })
    props.onNext()
  }

  return (
    <div id="NewVehicleStep4" className={newBookingSectionClassName}>
      <div id="Header" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={4} current={2} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...formData}>
        <form
          id="Step4Form"
          onSubmit={formData.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="Step4Fields" className="flex flex-col gap-3 lg:gap-4">
            <DashboardInput
              name={"defaultRatePerKm"}
              type="tel"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <DashboardSwitch name={"hasAC"} label={t("Field2.Title")} />
            <DashboardInput
              name={"defaultAcChargePerDay"}
              type="tel"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
              disabled={!formData.watch("hasAC")}
            />
          </div>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"secondary"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && <Spinner />}
            {formData.formState.isSubmitting ? t("Loading") : t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
