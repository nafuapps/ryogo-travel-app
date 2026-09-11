"use client"

import {
  RyogoFileInput,
  RyogoDatePicker,
  RyogoInput,
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
import { changeDriverLicenseAction } from "@/app/actions/drivers/changeDriverLicenseAction"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { FileRegex, SupportedImageFormats } from "@/lib/regex"
import {
  RyogoDefaultButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  MAX_FILE_UPLOAD_SIZE,
  MIN_LICENSE_LENGTH,
  MAX_LICENSE_LENGTH,
} from "@/lib/uiConfig"
import {
  FormWrapper,
  SheetContentWrapper,
} from "@/components/page/pageWrappers"

export default function ChangeDriverPhotoSheet({
  driverId,
  agencyId,
  addedByUserId,
  lNumber,
  lExpiresOn,
}: {
  driverId: string
  agencyId: string
  addedByUserId: string
  lNumber: string | null
  lExpiresOn: Date | null
}) {
  const t = useTranslations("Dashboard.DriverDetails.ChangeLicense")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const modifyDriverSchema = z.object({
    licenseNumber: z
      .string()
      .trim()
      .min(MIN_LICENSE_LENGTH, t("Field1.Error1"))
      .max(MAX_LICENSE_LENGTH, t("Field1.Error2"))
      .optional(),
    licenseExpiresOn: z
      .date(t("Field2.Error1"))
      .min(lExpiresOn ?? new Date(), t("Field2.Error2"))
      .nonoptional(t("Field2.Error1")),
    licensePhotos: FileRegex.refine((file) => {
      if (file.length < 1) return true
      return file[0] && file[0].size < MAX_FILE_UPLOAD_SIZE
    }, t("Field3.Error2"))
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && SupportedImageFormats.includes(file[0].type)
      }, t("Field3.Error3"))
      .optional(),
  })

  type ChangeDriverLicenseType = z.infer<typeof modifyDriverSchema>

  const form = useForm<ChangeDriverLicenseType>({
    resolver: zodResolver(modifyDriverSchema),
    defaultValues: {
      licenseNumber: lNumber ?? undefined,
      licenseExpiresOn: lExpiresOn ?? undefined,
    },
  })

  const onSubmit = async (data: ChangeDriverLicenseType) => {
    setOpen(false)
    const updatedDriver = await changeDriverLicenseAction({
      driverId,
      agencyId,
      addedByUserId,
      licenseNumber: data.licenseNumber,
      licenseExpiresOn: data.licenseExpiresOn,
      licensePhotos: data.licensePhotos,
    })
    if (updatedDriver) {
      toast.success(t("Success"))
      router.refresh()
    } else {
      toast.error(t("Error"))
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <RyogoGhostButton
          className="w-full"
          label={t("Button")}
          labelColor="light"
        />
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Header")}</SheetTitle>
        </SheetHeader>
        <FormWrapper<ChangeDriverLicenseType>
          id="changeLicense"
          onSubmit={form.handleSubmit(onSubmit)}
          form={form}
          hFull={false}
        >
          <SheetContentWrapper>
            <RyogoInput
              name={"licenseNumber"}
              type="text"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              description={t("Field1.Description")}
            />
            <RyogoDatePicker
              name="licenseExpiresOn"
              label={t("Field2.Title")}
              placeholder={t("Field2.Placeholder")}
              description={t("Field2.Description")}
            />
            <RyogoFileInput
              name={"licensePhotos"}
              register={form.register("licensePhotos")}
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
              description={t("Field3.Description")}
            />
          </SheetContentWrapper>
        </FormWrapper>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeLicense"
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
