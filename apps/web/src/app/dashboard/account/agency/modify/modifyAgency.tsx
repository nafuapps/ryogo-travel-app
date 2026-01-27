"use client"

import {
  DashboardFileInput,
  DashboardInput,
  DashboardSelect,
  DashboardTextarea,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAgencyByIdType } from "@ryogo-travel-app/api/services/agency.services"
import { useTranslations } from "next-intl"
import { useRef, useEffect } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import stateCityData from "@/lib/states_cities.json"
import {
  getArrayValueDisplayPairs,
  getStringValueDisplayPairs,
} from "@/lib/utils"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { modifyAgencyAction } from "./modifyAgencyAction"
import { ModifyAgencyRequestType } from "@ryogo-travel-app/api/types/agency.types"

export default function ModifyAgencyPageForm({
  agency,
}: {
  agency: FindAgencyByIdType
}) {
  const t = useTranslations("Dashboard.ModifyAgency")
  const router = useRouter()
  const schema = z.object({
    agencyName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    agencyAddress: z
      .string()
      .min(20, t("Field2.Error1"))
      .max(300, t("Field2.Error2")),
    agencyLogo: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0]!.size < 1000000
      }, t("Field3.Error1"))
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
      }, t("Field3.Error2"))
      .optional(),
    commissionRate: z.coerce
      .number<number>(t("Field4.Error1"))
      .min(1, t("Field4.Error2"))
      .max(100, t("Field4.Error3"))
      .positive(t("Field4.Error4"))
      .multipleOf(1, t("Field4.Error5"))
      .optional(),
    agencyState: z.string().min(1, t("Field5.Error1")),
    agencyCity: z.string().min(1, t("Field6.Error1")),
  })

  type SchemaType = z.infer<typeof schema>
  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      agencyName: agency.businessName,
      agencyAddress: agency.businessAddress,
      commissionRate: agency.defaultCommissionRate,
      agencyState: agency.location.state,
      agencyCity: agency.location.city,
    },
  })

  //Submit actions
  async function onSubmit(data: SchemaType) {
    const modifyAgencyData: ModifyAgencyRequestType = {
      agencyId: agency.id,
      businessName: data.agencyName,
      businessAddress: data.agencyAddress,
      logo: data.agencyLogo,
      defaultCommissionRate: data.commissionRate,
      agencyState: data.agencyState,
      agencyCity: data.agencyCity,
    }
    const modifiedAgency = await modifyAgencyAction(modifyAgencyData)
    if (modifiedAgency) {
      router.replace(`/dashboard/account/agency`)
      toast.success(t("Success"))
    } else {
      router.back()
      toast.error(t("Error"))
    }
  }

  const data: Record<string, string[]> = stateCityData
  const selectedState = formData.watch("agencyState")
  const cityOptions = selectedState
    ? (data[selectedState] ?? [t("Field6.Title")])
    : []
  const setValue = formData.setValue

  const isFirstRender = useRef(true)

  useEffect(() => {
    // Skip on the initial render of the component
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setValue("agencyCity", "") // Reset the city dropdown's value when the state dropdown changes
  }, [selectedState, setValue])

  return (
    <div id="ModifyAgencyPage" className={pageClassName}>
      <Form {...formData}>
        <form
          id="Form"
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
          onSubmit={formData.handleSubmit(onSubmit)}
        >
          <DashboardInput
            name={"agencyName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <DashboardTextarea
            name={"agencyAddress"}
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
          />
          <DashboardFileInput
            name={"agencyLogo"}
            register={formData.register("agencyLogo")}
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <DashboardInput
            name={"commissionRate"}
            type="tel"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
          />
          <DashboardSelect
            name={"agencyState"}
            register={formData.register("agencyState")}
            title={t("Field5.Title")}
            array={getArrayValueDisplayPairs(data)}
            placeholder={t("Field5.Title")}
          />
          <DashboardSelect
            name={"agencyCity"}
            register={formData.register("agencyCity")}
            title={t("Field6.Title")}
            array={getStringValueDisplayPairs(cityOptions)}
            placeholder={t("Field6.Title")}
          />
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
            onClick={() => router.back()}
            disabled={formData.formState.isSubmitting}
          >
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
