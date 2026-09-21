"use client"

import { addFeedbackAction } from "@/app/actions/feedback/addFeedbackAction"
import {
  RyogoDefaultButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import {
  RyogoRatingInput,
  RyogoTextarea,
  RyogoThumbsInput,
} from "@/components/form/ryogoFormFields"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoCaption, RyogoH4 } from "@/components/typography"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  MAX_FIELD_DESC_LENGTH,
  MIN_FIELD_DESC_LENGTH,
  TOTAL_RATING_STARS,
} from "@/lib/uiConfig"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  InsertProductFeedbackType,
  ProductFeedbackTypeEnum,
} from "@ryogo-travel-app/db/schema"
import { useTranslations } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import type { Route } from "next"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

export default function NewFeedbackComponent({
  entityId,
  feedbackType,
  userId,
  agencyId,
}: {
  entityId: string
  feedbackType: ProductFeedbackTypeEnum
  userId: string
  agencyId: string
}) {
  const t = useTranslations("Feedback")
  const router = useRouter()
  const pathname = usePathname()

  const [isOpen, setIsOpen] = useState(true)

  const [rating, setRating] = useState<number>(0)
  const [isLiked, setIsLiked] = useState<boolean | null>(null)

  const schema = z.object({
    remarks: z
      .string()
      .min(MIN_FIELD_DESC_LENGTH, t("Field3.Error1"))
      .max(MAX_FIELD_DESC_LENGTH, t("Field3.Error2"))
      .optional(),
  })

  type SchemaType = z.infer<typeof schema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: SchemaType) => {
    const feedback: InsertProductFeedbackType = {
      rating: rating === 0 ? null : rating,
      liked: isLiked,
      remarks: data.remarks,
      entityId: entityId,
      feedbackType: feedbackType,
      userId: userId,
      agencyId: agencyId,
    }
    const result = await addFeedbackAction(feedback)
    if (result) {
      toast.success(t("Success"))
      router.replace(pathname as Route)
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <RyogoH4>{t("Title")}</RyogoH4>
          </DialogTitle>
          <DialogDescription>
            <RyogoCaption color="light">{t("Description")}</RyogoCaption>
          </DialogDescription>
        </DialogHeader>
        <FormWrapper<SchemaType>
          id="newFeedback"
          onSubmit={form.handleSubmit(onSubmit)}
          form={form}
        >
          <FormContentWrapper asCard={false}>
            <RyogoThumbsInput
              name="liked"
              label={t("Field1.Title", { type: feedbackType })}
              isLiked={isLiked}
              setIsLiked={setIsLiked}
            />
            <RyogoRatingInput
              name="rating"
              label={t("Field2.Title")}
              selectedStars={rating}
              setSelectedStars={setRating}
              totalStars={TOTAL_RATING_STARS}
            />
            <RyogoTextarea
              name="remarks"
              label={t("Field3.Title")}
              placeholder={t("Field3.Placeholder")}
            />
          </FormContentWrapper>
        </FormWrapper>
        <StickyActionWrapper bgTransparent>
          <RyogoDefaultButton
            type="submit"
            disabled={form.formState.isSubmitting}
            showSpinner={form.formState.isSubmitting}
            form="newFeedback"
            label={form.formState.isSubmitting ? t("Loading") : t("Submit")}
          />
          <RyogoOutlineButton
            label={t("Skip")}
            type="button"
            disabled={form.formState.isSubmitting}
            onClick={() => setIsOpen(false)}
          />
        </StickyActionWrapper>
      </DialogContent>
    </Dialog>
  )
}
