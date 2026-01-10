import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form } from "@/components/ui/form"
import { Dispatch, SetStateAction } from "react"
import { NewDriverFormDataType } from "./newDriverForm"
import {
  DashboardFileInput,
  DashboardInput,
} from "@/components/form/dashboardFormFields"
import {
  newBookingFormClassName,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingSectionClassName,
} from "../../bookings/new/newBookingCommon"
import { CaptionGrey, H4, SmallGrey } from "@/components/typography"
import NewBookingStepsTracker from "../../bookings/new/newBookingStepsTracker"
import { Button } from "@/components/ui/button"
import { SelectUserType } from "@ryogo-travel-app/db/schema"

export function NewDriverStep1(props: {
  onNext: () => void
  newDriverFormData: NewDriverFormDataType
  setNewDriverFormData: Dispatch<SetStateAction<NewDriverFormDataType>>
  agencyId: string
  allDrivers: SelectUserType[]
}) {
  const t = useTranslations("Dashboard.NewDriver.Step1")

  const step1Schema = z.object({
    driverName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    driverPhone: z.string().length(10, t("Field2.Error1")),
    driverEmail: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")),
    driverPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0]!.size < 1000000
      }, t("Field4.Error1"))
      .refine((file) => {
        if (file.length < 1) return true
        return (
          file[0] &&
          [
            "image/jpeg",
            "image/png",
            "image/jpg",
            "image/bmp",
            "image/webp",
          ].includes(file[0]!.type)
        )
      }, t("Field4.Error2"))
      .optional(),
  })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      driverName: props.newDriverFormData.name,
      driverPhone: props.newDriverFormData.phone,
      driverEmail: props.newDriverFormData.email,
      driverPhotos: props.newDriverFormData.driverPhotos,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    if (
      props.allDrivers.some(
        (u) => u.phone == data.driverPhone && u.agencyId == props.agencyId
      )
    ) {
      // Check if a driver with same phone exists in this agency
      formData.setError("driverPhone", {
        type: "manual",
        message: t("APIError1"),
      })
    } else if (
      props.allDrivers.some(
        (u) => u.phone == data.driverPhone && u.email == data.driverEmail
      )
    ) {
      // Check if a driver with same phone and email exists in entire DB
      formData.setError("driverPhone", {
        type: "manual",
        message: t("APIError2"),
      })
    } else {
      if (!formData.formState.errors.driverPhone) {
        props.setNewDriverFormData({
          ...props.newDriverFormData,
          name: data.driverName,
          phone: data.driverPhone,
          email: data.driverEmail,
          driverPhotos: data.driverPhotos,
        })
        props.onNext()
      }
    }
  }

  return (
    <div id="NewDriverStep1" className={newBookingSectionClassName}>
      <div id="Header" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={4} current={0} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...formData}>
        <form
          id="Step1Form"
          onSubmit={formData.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <div id="Step1Fields" className="flex flex-col gap-3 lg:gap-4">
            <DashboardInput
              name={"driverName"}
              type="text"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <DashboardInput
              name={"driverPhone"}
              type="tel"
              label={t("Field2.Title")}
              placeholder={t("Field2.Placeholder")}
              description={t("Field2.Description")}
            />
            <DashboardInput
              name={"driverEmail"}
              type="email"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
            />
            <DashboardFileInput
              name={"agenctPhotos"}
              register={formData.register("driverPhotos")}
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
        </form>
      </Form>
    </div>
  )
}
