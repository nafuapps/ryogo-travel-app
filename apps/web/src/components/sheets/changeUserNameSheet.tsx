"use client"

import { RyogoInput } from "@/components/form/ryogoFormFields"
import { Form } from "@/components/ui/form"
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
import { changeUserNameAction } from "@/app/actions/users/changeUserNameAction"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { Type } from "lucide-react"

export default function ChangeUserNameSheet({
  userId,
  agencyId,
  userName,
  userRole,
}: {
  userId: string
  agencyId: string
  userName: string
  userRole: UserRolesEnum
}) {
  const t = useTranslations("Sheets.ChangeName")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    name: z.string().min(5, t("Error1")).max(30, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userName,
    },
  })

  const onSubmit = async (data: SchemaType) => {
    setOpen(false)
    const updatedUser = await changeUserNameAction(
      userId,
      agencyId,
      data.name,
      userRole,
    )
    if (updatedUser) {
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
          label={t("Title")}
          icon={Type}
          subtitle={t("Subtitle")}
        />
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85dvh] max-h-[85dvh]">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form id="changeName" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="p-4 lg:p-5">
              <RyogoInput
                name={"name"}
                type="text"
                label={t("InputTitle")}
                placeholder={t("Placeholder")}
              />
            </div>
          </form>
        </Form>
        <SheetFooter>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            form="changeName"
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
