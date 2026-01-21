import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { Dispatch, SetStateAction } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form } from "@/components/ui/form"
import { NewVehicleFormDataType } from "./newVehicleForm"
import {
  DashboardDatePicker,
  DashboardFileInput,
  DashboardInput,
} from "@/components/form/dashboardFormFields"
import { Button } from "@/components/ui/button"
import { H4, CaptionGrey, SmallGrey } from "@/components/typography"
import {
  newBookingSectionClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingFormClassName,
} from "../../bookings/new/newBookingCommon"
import NewBookingStepsTracker from "../../bookings/new/newBookingStepsTracker"

export function NewVehicleStep2(props: {
  onNext: () => void
  onPrev: () => void
  newVehicleFormData: NewVehicleFormDataType
  setNewVehicleFormData: Dispatch<SetStateAction<NewVehicleFormDataType>>
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step2")

  const step2Schema = z.object({
    capacity: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(0, t("Field1.Error2"))
      .max(100, t("Field1.Error3"))
      .multipleOf(1, t("Field1.Error4"))
      .nonnegative(t("Field1.Error5")),
    odometerReading: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(0, t("Field2.Error2"))
      .max(1000000, t("Field2.Error3"))
      .multipleOf(1, t("Field2.Error4"))
      .nonnegative(t("Field2.Error5")),
    rcPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1
      }, t("Field3.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0]!.size < 1000000
      }, t("Field3.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
      }, t("Field3.Error3")),
    vehiclePhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1
      }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0]!.size < 1000000
      }, t("Field4.Error2"))
      .refine((file) => {
        if (file.length < 1) return false
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
            "application/pdf",
          ].includes(file[0].type)
        )
      }, t("Field4.Error3")),
    rcExpiresOn: z
      .date(t("Field5.Error1"))
      .min(new Date(), t("Field5.Error2"))
      .nonoptional(t("Field5.Error1")),
  })
  type Step2Type = z.infer<typeof step2Schema>
  const formData = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      capacity: props.newVehicleFormData.capacity,
      odometerReading: props.newVehicleFormData.odometerReading,
      rcPhotos: props.newVehicleFormData.rcPhotos,
      vehiclePhotos: props.newVehicleFormData.vehiclePhotos,
      rcExpiresOn: props.newVehicleFormData.rcExpiresOn,
    },
  })

  //Submit actions
  const onSubmit = (data: Step2Type) => {
    props.setNewVehicleFormData({
      ...props.newVehicleFormData,
      capacity: data.capacity,
      odometerReading: data.odometerReading,
      rcPhotos: data.rcPhotos,
      vehiclePhotos: data.vehiclePhotos,
      rcExpiresOn: data.rcExpiresOn,
    })
    props.onNext()
  }
  return (
    <div id="NewVehicleStep2" className={newBookingSectionClassName}>
      <div id="Header" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={4} current={1} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...formData}>
        <form
          id="Step2Form"
          onSubmit={formData.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="Step2Fields" className="flex flex-col gap-3 lg:gap-4">
            <DashboardInput
              name={"capacity"}
              type="tel"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <DashboardInput
              name={"odometerReading"}
              type="tel"
              label={t("Field2.Title")}
              placeholder={t("Field2.Placeholder")}
              description={t("Field2.Description")}
            />
            <DashboardFileInput
              name={"rcPhotos"}
              register={formData.register("rcPhotos")}
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
            />
            <DashboardFileInput
              name={"vehiclePhotos"}
              register={formData.register("vehiclePhotos")}
              label={t("Field4.Title")}
              placeholder={t("Field4.Placeholder")}
              description={t("Field4.Description")}
            />
            <DashboardDatePicker
              name="rcExpiresOn"
              label={t("Field5.Title")}
              placeholder={t("Field5.Placeholder")}
              description={t("Field5.Description")}
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
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
