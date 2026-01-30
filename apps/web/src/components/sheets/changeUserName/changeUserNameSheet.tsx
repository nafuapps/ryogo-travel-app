"use client"

import { DashboardInput } from "@/components/form/dashboardFormFields"
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
import { changeUserNameAction } from "../../../app/actions/changeUserNameAction"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"

export default function ChangeUserNameSheet({
  userId,
  userName,
  userRole,
}: {
  userId: string
  userName: string
  userRole: UserRolesEnum
}) {
  const t = useTranslations("Sheets.ChangeName")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const schema = z.object({
    name: z.string().min(5, t("Error1")).max(30, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const formData = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userName,
    },
  })

  const onSubmit = async (data: SchemaType) => {
    startTransition(async () => {
      if (await changeUserNameAction(userId, data.name, userRole)) {
        toast.success(t("Success"))
        router.refresh()
      } else {
        toast.error(t("Error"))
      }
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          {t("Title")}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <Form {...formData}>
          <form id="changeName" onSubmit={formData.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <DashboardInput
                name={"name"}
                type="text"
                label={t("Title")}
                placeholder={t("Placeholder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" disabled={isPending} form="changeName">
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
