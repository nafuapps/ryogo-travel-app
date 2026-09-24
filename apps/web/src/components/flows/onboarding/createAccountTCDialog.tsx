"use client"

import {
  RyogoDefaultButton,
  RyogoDestructiveButton,
  RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Eye, CheckCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import {
  RyogoH3,
  RyogoH4,
  RyogoSmall,
  RyogoTiny,
} from "@/components/typography"
import { Ref, useRef, useState } from "react"
import {
  SectionColWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import {
  LEGAL_ADDRESS,
  LEGAL_EMAIL,
  LEGAL_PHONE,
  SUBSCRIPTION_DOWNGRADE_TO_BASIC_GRACE_DAYS,
  SUPPORT_EMAIL,
} from "@/lib/uiConfig"

export default function CreateAccountTCDialog({
  acceptedTC,
  setAcceptedTC,
}: {
  acceptedTC: boolean
  setAcceptedTC: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const t = useTranslations("TermsAndConditions.CreateAccount")
  const [open, setOpen] = useState(false)
  const [hasRead, setHasRead] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleScroll: React.UIEventHandler<HTMLDivElement> = (event) => {
    const element = event.currentTarget
    const isAtBottom =
      element.scrollTop + element.clientHeight >= element.scrollHeight - 1

    if (isAtBottom) {
      setHasRead(true)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {acceptedTC ? (
          <RyogoGhostButton
            size="lg"
            label={t("AgreedLabel")}
            labelColor={"green"}
            className="opacity-90"
          >
            <RyogoIcon size="sm" icon={CheckCheck} color={"green"} thick />
          </RyogoGhostButton>
        ) : (
          <RyogoDefaultButton size="lg" label={t("TriggerLabel")}>
            <RyogoIcon size="sm" icon={Eye} color={"white"} thick />
          </RyogoDefaultButton>
        )}
      </DialogTrigger>
      <DialogContent className="size-5/6 overflow-hidden">
        <DialogHeader>
          <DialogTitle>
            <RyogoH3>{t("Title")}</RyogoH3>
          </DialogTitle>
          <DialogDescription>
            <RyogoSmall color="light">{t("Subtitle")}</RyogoSmall>
          </DialogDescription>
        </DialogHeader>
        <CreateAccountTCContent ref={scrollRef} onScroll={handleScroll} />
        <StickyActionWrapper bgTransparent>
          {acceptedTC ? (
            <RyogoOutlineButton
              label={t("Accepted")}
              labelColor={"green"}
              disabled
            >
              <RyogoIcon icon={CheckCheck} size="xs" color={"green"} thick />
            </RyogoOutlineButton>
          ) : (
            <RyogoDefaultButton
              label={t("Accept")}
              disabled={!hasRead}
              onClick={() => {
                setOpen(false)
                setAcceptedTC(true)
              }}
            />
          )}
          {acceptedTC && (
            <RyogoDestructiveButton
              label={t("Reject")}
              onClick={() => {
                setOpen(false)
                setAcceptedTC(false)
              }}
            />
          )}
          <RyogoGhostButton
            label={t("Close")}
            labelColor="light"
            onClick={() => setOpen(false)}
          />
        </StickyActionWrapper>
      </DialogContent>
    </Dialog>
  )
}

function CreateAccountTCContent({
  ref,
  onScroll,
}: {
  ref: Ref<HTMLDivElement>
  onScroll: React.UIEventHandler<HTMLDivElement>
}) {
  const t = useTranslations("TermsAndConditions.CreateAccount.Content")
  return (
    <div ref={ref} onScroll={onScroll} className="min-h-0 overflow-y-auto">
      <SectionColWrapper>
        <RyogoTiny color="light">{t("LastUpdated")}</RyogoTiny>
        <RyogoSmall color="slate">{t("Welcome1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Welcome2")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("DescriptionService.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("DescriptionService.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("DescriptionService.Body2")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Account.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Account.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Account.Body2")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Account.Body3")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Account.Body4")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Account.Body5")}</RyogoSmall>
        <RyogoSmall color="slate">
          {t("Account.Body6", { supportEmail: SUPPORT_EMAIL })}
        </RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Subscription.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Subscription.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Subscription.Body2")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Subscription.Body3")}</RyogoSmall>
        <RyogoSmall color="slate">
          {t("Subscription.Body4", {
            gracePeriod: SUBSCRIPTION_DOWNGRADE_TO_BASIC_GRACE_DAYS,
          })}
        </RyogoSmall>
        <RyogoSmall color="slate">{t("Subscription.Body5")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Subscription.Body6")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Use.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Use.Subtitle")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body2")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body3")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body4")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body5")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body6")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body7")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Use.Body8")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Compliance.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Compliance.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Compliance.Body2")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Compliance.Body3")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Compliance.Body4")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Data.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Data.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Data.Body2")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Data.Body3")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Data.Body4")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Data.Body5")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Data.Body6")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("IP.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("IP.Body")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Support.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Support.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Support.Body2")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Liability.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Liability.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Liability.Body2")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Liability.Body3")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Termination.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Termination.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Termination.Body2")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Termination.Body3")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Modification.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Modification.Body")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Law.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Law.Body")}</RyogoSmall>
        <RyogoH4 weight="font-bold">{t("Contact.Title")}</RyogoH4>
        <RyogoSmall color="slate">{t("Contact.Subtitle")}</RyogoSmall>
        <RyogoSmall color="slate">{t("Contact.Body1")}</RyogoSmall>
        <RyogoSmall color="slate">
          {t("Contact.Body2", { contactEmail: LEGAL_EMAIL })}
        </RyogoSmall>
        <RyogoSmall color="slate">
          {t("Contact.Body3", { contactAddress: LEGAL_ADDRESS })}
        </RyogoSmall>
        <RyogoSmall color="slate">
          {t("Contact.Body4", { contactPhone: LEGAL_PHONE })}
        </RyogoSmall>
      </SectionColWrapper>
    </div>
  )
}
