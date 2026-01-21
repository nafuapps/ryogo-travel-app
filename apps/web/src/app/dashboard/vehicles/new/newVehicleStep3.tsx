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
  DashboardDatePicker,
  DashboardFileInput,
} from "@/components/form/dashboardFormFields"
import { H4, CaptionGrey, SmallGrey } from "@/components/typography"
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
    insuranceExpiresOn: z
      .date(t("Field1.Error1"))
      .min(new Date(), t("Field1.Error2"))
      .nonoptional(t("Field1.Error1")),
    insurancePhotos: z
      .instanceof(FileList)
      .refine((file) => {
        return file.length >= 1
      }, t("Field2.Error1"))
      .refine((file) => {
        if (file.length < 1) return false
        return file[0]!.size < 1000000
      }, t("Field2.Error2"))
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
          ].includes(file[0]!.type)
        )
      }, t("Field2.Error3")),
    pucExpiresOn: z
      .date(t("Field3.Error1"))
      .min(new Date(), t("Field3.Error2"))
      .nonoptional(t("Field3.Error1")),
    pucPhotos: z
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
          ].includes(file[0]!.type)
        )
      }, t("Field4.Error3")),
  })
  type Step3Type = z.infer<typeof step3Schema>
  const formData = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      insuranceExpiresOn: props.newVehicleFormData.insuranceExpiresOn,
      insurancePhotos: props.newVehicleFormData.insurancePhotos,
      pucExpiresOn: props.newVehicleFormData.pucExpiresOn,
      pucPhotos: props.newVehicleFormData.pucPhotos,
    },
  })

  //Submit actions
  const onSubmit = (data: Step3Type) => {
    props.setNewVehicleFormData({
      ...props.newVehicleFormData,
      insuranceExpiresOn: data.insuranceExpiresOn,
      insurancePhotos: data.insurancePhotos,
      pucExpiresOn: data.pucExpiresOn,
      pucPhotos: data.pucPhotos,
    })
    props.onNext()
  }

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
            <DashboardDatePicker
              name="insuranceExpiresOn"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <DashboardFileInput
              name={"insurancePhotos"}
              register={formData.register("insurancePhotos")}
              label={t("Field2.Title")}
              placeholder={t("Field2.Placeholder")}
              description={t("Field2.Description")}
            />
            <DashboardDatePicker
              name="pucExpiresOn"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
            />
            <DashboardFileInput
              name={"pucPhotos"}
              register={formData.register("pucPhotos")}
              label={t("Field4.Title")}
              placeholder={t("Field4.Placeholder")}
              description={t("Field4.Description")}
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
