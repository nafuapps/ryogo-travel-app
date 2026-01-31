"use client"

import {
  DashboardInput,
  DashboardFileInput,
} from "@/components/form/dashboardFormFields"
import { pageClassName } from "@/components/page/pageCommons"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Spinner } from "@/components/ui/spinner"
import { zodResolver } from "@hookform/resolvers/zod"
import { FindAllUsersByRoleType } from "@ryogo-travel-app/api/services/user.services"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
import { AddAgentRequestType } from "@ryogo-travel-app/api/types/user.types"
import { addAgentAction } from "@/app/actions/users/addAgentAction"

export default function NewAgentForm({
  agencyId,
  allAgents,
}: {
  agencyId: string
  allAgents: FindAllUsersByRoleType
}) {
  const t = useTranslations("Dashboard.NewAgent")
  const router = useRouter()

  const newAgentSchema = z.object({
    agentName: z
      .string()
      .min(5, t("Field1.Error1"))
      .max(30, t("Field1.Error2")),
    agentPhone: z.string().length(10, t("Field2.Error1")),
    agentEmail: z.email(t("Field3.Error1")).max(60, t("Field3.Error2")),
    agentPhotos: z
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
  type NewAgentType = z.infer<typeof newAgentSchema>

  //Form init
  const formData = useForm<NewAgentType>({
    resolver: zodResolver(newAgentSchema),
  })

  //Form submit
  async function onSubmit(values: NewAgentType) {
    if (
      allAgents.some(
        (u) => u.phone == values.agentPhone && u.agencyId == agencyId,
      )
    ) {
      // Check if an agent with same phone exists in this agency
      formData.setError("agentPhone", {
        type: "manual",
        message: t("APIError1"),
      })
    } else if (
      allAgents.some(
        (u) => u.phone == values.agentPhone && u.email == values.agentEmail,
      )
    ) {
      // Check if an agent with same phone and email exists in entire DB
      formData.setError("agentPhone", {
        type: "manual",
        message: t("APIError2"),
      })
    } else {
      const newAgentData: AddAgentRequestType = {
        agencyId: agencyId,
        data: {
          name: values.agentName,
          phone: values.agentPhone,
          email: values.agentEmail,
          photos: values.agentPhotos,
        },
      }
      const createdAgent = await addAgentAction(newAgentData)
      if (createdAgent) {
        toast.success(t("Success"))
        router.replace(`/dashboard/users/${createdAgent.id}`)
      } else {
        toast.error(t("Error"))
        router.replace(`/dashboard/users`)
      }
    }
  }

  return (
    <div id="NewAgentPage" className={pageClassName}>
      <Form {...formData}>
        <form
          onSubmit={formData.handleSubmit(onSubmit)}
          id="newAgentForm"
          className="flex flex-col gap-4 lg:gap-4 p-4 lg:p-5 bg-white rounded-lg shadow w-full"
        >
          <DashboardInput
            name={"agentName"}
            type="text"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <DashboardInput
            name={"agentPhone"}
            type="tel"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <DashboardInput
            name={"agentEmail"}
            type="email"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
          <DashboardFileInput
            name={"agenctPhotos"}
            register={formData.register("agentPhotos")}
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
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
            variant={"outline"}
            size={"default"}
            type="button"
            disabled={formData.formState.isSubmitting}
            onClick={() => router.back()}
          >
            {t("SecondaryCTA")}
          </Button>
        </form>
      </Form>
    </div>
  )
}
