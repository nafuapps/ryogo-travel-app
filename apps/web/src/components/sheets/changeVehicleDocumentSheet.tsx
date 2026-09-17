"use client"

import {
  RyogoFileInput,
  RyogoDatePicker,
} from "@/components/form/ryogoFormFields"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { MAX_FILE_UPLOAD_SIZE } from "@/lib/uiConfig"
import { FormWrapper, FormContentWrapper } from "@/components/page/pageWrappers"
import { IdCard } from "lucide-react"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { changeVehicleDocumentAction } from "@/app/actions/vehicles/changeVehicleDocumentAction"

export default function ChangeVehiclePhotoSheet({
  vehicleId,
  agencyId,
  addedByUserId,
  expiresOn,
  documentType,
}: {
  vehicleId: string
  agencyId: string
  addedByUserId: string
  expiresOn: Date | null
  documentType: "rc" | "insurance" | "puc"
}) {
  const t = useTranslations("Dashboard.VehicleDetails.ChangeDocument")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const modifyVehicleSchema = z.object({
    documentExpiresOn: z
      .date(t("Field1.Error1"))
      .min(expiresOn ?? new Date(), t("Field1.Error2"))
      .nonoptional(t("Field1.Error1")),
    documentPhoto: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Field2.Error2"))
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field2.Error3"))
      .optional(),
  })

  type ChangeVehicleLicenseType = z.infer<typeof modifyVehicleSchema>

  const form = useForm<ChangeVehicleLicenseType>({
    resolver: zodResolver(modifyVehicleSchema),
    defaultValues: {
      documentExpiresOn: expiresOn ?? undefined,
    },
  })

  const onSubmit = async (data: ChangeVehicleLicenseType) => {
    setOpen(false)
    const updatedVehicle = await changeVehicleDocumentAction({
      vehicleId,
      agencyId,
      addedByUserId,
      type: documentType,
      expiresOn: data.documentExpiresOn,
      photo: data.documentPhoto,
    })
    if (updatedVehicle) {
      toast.success(t("Success"))
      router.refresh()
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <RyogoDetailedIconButton
          label={
            documentType === "rc"
              ? t("ButtonRC")
              : documentType === "puc"
                ? t("ButtonPUC")
                : t("ButtonInsurance")
          }
          icon={IdCard}
          subtitle={
            documentType === "rc"
              ? t("SubtitleRC")
              : documentType === "puc"
                ? t("SubtitlePUC")
                : t("SubtitleInsurance")
          }
        />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>
            {documentType === "rc"
              ? t("SubtitleRC")
              : documentType === "puc"
                ? t("SubtitlePUC")
                : t("SubtitleInsurance")}
          </SheetTitle>
        </SheetHeader>
        <FormWrapper<ChangeVehicleLicenseType>
          id="changeDocument"
          onSubmit={form.handleSubmit(onSubmit)}
          form={form}
        >
          <FormContentWrapper asCard={false} className="px-4 lg:px-5">
            <RyogoDatePicker
              name="documentExpiresOn"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <RyogoFileInput
              name={"documentPhoto"}
              register={form.register("documentPhoto")}
              label={t("Field2.Title")}
              placeholder={t("Field2.Placeholder")}
              description={t("Field2.Description")}
            />
          </FormContentWrapper>
        </FormWrapper>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeDocument"
            label={t("Save")}
          />
          <RyogoOutlineButton
            disabled={form.formState.isSubmitting}
            type="button"
            onClick={() => setOpen(false)}
            label={t("Close")}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
