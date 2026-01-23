import { zodResolver } from "@hookform/resolvers/zod"
import { Spinner } from "@/components/ui/spinner"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import z from "zod"
import { Form } from "@/components/ui/form"
import { Dispatch, SetStateAction } from "react"
import { NewVehicleFormDataType } from "./newVehicleForm"
import {
  DashboardInput,
  DashboardSelect,
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
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema"
import { getEnumValueDisplayPairs } from "@/lib/utils"

export function NewVehicleStep1(props: {
  onNext: () => void
  newVehicleFormData: NewVehicleFormDataType
  setNewVehicleFormData: Dispatch<SetStateAction<NewVehicleFormDataType>>
  agencyId: string
  existingVehicles: string[]
}) {
  const t = useTranslations("Dashboard.NewVehicle.Step1")

  const step1Schema = z.object({
    vehicleNumber: z
      .string()
      .trim()
      .min(7, t("Field1.Error1"))
      .max(15, t("Field1.Error2")),
    type: z.enum(VehicleTypesEnum).nonoptional(t("Field2.Error1")),
    brand: z.string().min(3, t("Field3.Error1")).max(15, t("Field3.Error2")),
    color: z.string().min(3, t("Field4.Error1")).max(15, t("Field4.Error2")),
    model: z.string().min(3, t("Field5.Error1")).max(30, t("Field5.Error2")),
  })

  type Step1Type = z.infer<typeof step1Schema>

  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      vehicleNumber: props.newVehicleFormData.vehicleNumber,
      type: props.newVehicleFormData.type,
      brand: props.newVehicleFormData.brand,
      color: props.newVehicleFormData.color,
      model: props.newVehicleFormData.model,
    },
  })

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    // Check if a vehicle with same number exists in this agency
    if (props.existingVehicles.includes(data.vehicleNumber)) {
      //If vehicle exists in agency, show error
      formData.setError("vehicleNumber", {
        type: "manual",
        message: t("APIError"),
      })
    } else {
      if (!formData.formState.errors.vehicleNumber) {
        props.setNewVehicleFormData({
          ...props.newVehicleFormData,
          vehicleNumber: data.vehicleNumber,
          type: data.type,
          brand: data.brand,
          color: data.color,
          model: data.model,
        })
        props.onNext()
      }
    }
  }

  return (
    <div id="NewVehicleStep1" className={newBookingSectionClassName}>
      <div id="Header" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={5} current={0} />
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
              name={"vehicleNumber"}
              type="text"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <DashboardSelect
              name={"type"}
              register={formData.register("type")}
              array={getEnumValueDisplayPairs(VehicleTypesEnum)}
              title={t("Field2.Title")}
              placeholder={t("Field2.Title")}
            />
            <DashboardInput
              name={"brand"}
              type="text"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
            />
            <DashboardInput
              name={"color"}
              type="text"
              label={t("Field4.Title")}
              placeholder={t("Field4.Placeholder")}
              description={t("Field4.Description")}
            />
            <DashboardInput
              name={"model"}
              type="text"
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
        </form>
      </Form>
    </div>
  )
}
