"use client"

import { changeUserNameAction } from "@/app/actions/users/changeUserNameAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import RyogoDetailedIconButton from "@/components/buttons/ryogoDetailedIconButton"
import { RyogoInput } from "@/components/form/ryogoFormFields"
import { FormContentWrapper, FormWrapper } from "@/components/page/pageWrappers"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { MAX_NAME_LENGTH, MIN_NAME_LENGTH } from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { Type } from "lucide-react"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function ChangeUserNameSheet({
  userId,
  agencyId,
  userName,
  userRole,
  addedByUserId,
}: {
  userId: string
  agencyId: string
  userName: string
  userRole: UserRolesEnum
  addedByUserId?: string
}) {
  const t = useTranslations("Components.Sheets.ChangeName")
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const schema = z.object({
    name: z
      .string()
      .min(MIN_NAME_LENGTH, t("Error1"))
      .max(MAX_NAME_LENGTH, t("Error2")),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: userName,
    },
  })

  const onSubmit = async (values: SchemaType) => {
    setOpen(false)
    const updatedUser = await changeUserNameAction({
      userId,
      agencyId,
      name: values.name,
      userRole,
      addedByUserId,
    })
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
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>{t("Title")}</SheetTitle>
        </SheetHeader>
        <FormWrapper
          form={form}
          id="changeName"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormContentWrapper asCard={false} className="px-4 lg:px-5">
            <RyogoInput
              name={"name"}
              type="text"
              label={t("InputTitle")}
              placeholder={t("Placeholder")}
            />
          </FormContentWrapper>
        </FormWrapper>
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
