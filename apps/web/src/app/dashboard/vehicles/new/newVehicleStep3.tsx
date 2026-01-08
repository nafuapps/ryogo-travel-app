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
  DashboardMultipleCheckbox,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { H4, CaptionGrey, SmallGrey } from "@/components/typography"
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import {
  newBookingSectionClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingFormClassName,
} from "../../bookings/new/newBookingCommon"
import NewBookingStepsTracker from "../../bookings/new/newBookingStepsTracker"

export function NewVehicleStep3(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: NewVehicleFormDataType
  setNewVehicleFormData: Dispatch<SetStateAction<NewVehicleFormDataType>>
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step3")
  const step3Schema = z.object({
    vehicleAddress: z
      .string()
      .min(20, t("Field1.Error1"))
      .max(300, t("Field1.Error2")),
    canDriveVehicleTypes: z.array(z.string()).min(1, t("Field2.Error1")),
    defaultAllowancePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(1, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .positive(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5")),
  })
  type Step3Type = z.infer<typeof step3Schema>
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      vehicleAddress: props.newVehicleFormData.address,
      canDriveVehicleTypes: props.newVehicleFormData.canDriveVehicleTypes,
      defaultAllowancePerDay: props.newVehicleFormData.defaultAllowancePerDay,
    },
  })

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    props.setNewVehicleFormData({
      ...props.newVehicleFormData,
      address: data.vehicleAddress,
      canDriveVehicleTypes: data.canDriveVehicleTypes,
      defaultAllowancePerDay: data.defaultAllowancePerDay,
    })
    props.onNext()
  }

  const vehicles = Object.values(VehicleTypesEnum).map((i) => i.toUpperCase())

  return (
    <div id="NewVehicleStep3" className={newBookingSectionClassName}>
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
          id="Step3Form"
          onSubmit={formData.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="Step3Fields" className="flex flex-col gap-3 lg:gap-4">
            <DashboardTextarea
              name={"vehicleAddress"}
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
            />
            <DashboardMultipleCheckbox
              array={vehicles}
              name={"canDriveVehicleTypes"}
              label={t("Field2.Title")}
              register={formData.register("canDriveVehicleTypes")}
            />
            <DashboardInput
              name={"defaultAllowancePerDay"}
              type="tel"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
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
            type="submit"
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
