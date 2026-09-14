"use client"

import { RyogoFileInput } from "@/components/form/ryogoFormFields"
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
import { changeVehiclePhotoAction } from "@/app/actions/vehicles/changeVehiclePhotoAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { MAX_FILE_UPLOAD_SIZE } from "@/lib/uiConfig"
import { FormWrapper, FormContentWrapper } from "@/components/page/pageWrappers"

export default function ChangeVehiclePhotoSheet({
  vehicleId,
  agencyId,
}: {
  vehicleId: string
  agencyId: string
}) {
  const t = useTranslations("Dashboard.VehicleDetails.ChangeVehiclePhoto")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    vehiclePhotos: FileRegex.refine((file) => {
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Error1")).refine((file) => {
      return file[0] && SupportedImageFormats.includes(file[0].type)
    }, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    const updatedVehicle = await changeVehiclePhotoAction(
      vehicleId,
      agencyId,
      data.vehiclePhotos,
    )
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
        <RyogoGhostButton className="w-full" label={t("Button")} />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Header")}</SheetTitle>
        </SheetHeader>
        <FormWrapper
          form={form}
          id="changeVehiclePhoto"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormContentWrapper asCard={false} className="px-4 lg:px-5">
            <RyogoFileInput
              name={"vehiclePhotos"}
              register={form.register("vehiclePhotos")}
              label={t("Title")}
              placeholder={t("Placeholder")}
            />
          </FormContentWrapper>
        </FormWrapper>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeVehiclePhoto"
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
