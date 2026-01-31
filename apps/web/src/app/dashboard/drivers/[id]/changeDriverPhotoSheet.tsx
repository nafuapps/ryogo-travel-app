"use client"

import { DashboardFileInput } from "@/components/form/dashboardFormFields"
import { CaptionGrey } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import z from "zod"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { changeUserPhotoAction } from "@/app/actions/users/changeUserPhotoAction"

export default function ChangeDriverPhotoSheet({ userId }: { userId: string }) {
  const t = useTranslations("Dashboard.DriverDetails.ChangePhoto")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const schema = z.object({
    driverPhotos: z
      .instanceof(FileList)
      .refine((file) => {
        if (file.length < 1) return true
        return file[0] && file[0]!.size < 1000000
      }, t("Error1"))
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
      }, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    startTransition(async () => {
      if (await changeUserPhotoAction(userId, data.driverPhotos)) {
        toast.success(t("Success"))
        router.refresh()
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <Sheet>
      <SheetTrigger className="hover:underline">
        <CaptionGrey>{t("Button")}</CaptionGrey>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Header")}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <Form {...formData}>
          <form id="changePhoto" onSubmit={formData.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <DashboardFileInput
                name={"driverPhotos"}
                register={formData.register("driverPhotos")}
                label={t("Title")}
                placeholder={t("Placeholder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" disabled={isPending} form="changePhoto">
              {t("Save")}
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button variant="outline" disabled={isPending}>
              {t("Close")}
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
