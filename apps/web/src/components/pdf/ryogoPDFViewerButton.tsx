"use client"

import { DocumentProps, PDFViewer, usePDF } from "@react-pdf/renderer"
import { useIsMobile } from "@/hooks/useMobile"
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { LucideIcon } from "lucide-react"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import {
  RyogoBrandButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Download, SquareArrowOutUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { RyogoCaption } from "@/components/typography"
import { useEffect } from "react"

export default function RyogoPDFViewerButton({
  document,
  fileName,
  label,
  icon,
}: {
  document: React.ReactElement<DocumentProps>
  fileName: string
  label: string
  icon: LucideIcon
}) {
  const t = useTranslations("Components.MobilePDFViewer")
  const isMobile = useIsMobile()
  const [{ loading, url, error }, updateDocument] = usePDF()

  useEffect(() => {
    updateDocument(document)
  }, [document, updateDocument])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <RyogoOutlineButton label={label}>
          <RyogoIcon icon={icon} size="sm" color="slate" />
        </RyogoOutlineButton>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center size-5/6 p-4 lg:p-5">
        {isMobile ? (
          error ? (
            <RyogoCaption color="red">{t("Error")}</RyogoCaption>
          ) : loading || !url ? (
            <RyogoCaption color="white">{t("Generating")}</RyogoCaption>
          ) : null
        ) : (
          <PDFViewer className="w-full h-full gap-4">{document}</PDFViewer>
        )}
        {url && (
          <SectionColWrapper className="lg:flex-row grow-0">
            <a href={url} target="_blank" rel="noopener noreferrer">
              <RyogoBrandButton label={t("Open")} className="w-full">
                <RyogoIcon
                  icon={SquareArrowOutUpRight}
                  size="sm"
                  color="white"
                />
              </RyogoBrandButton>
            </a>
            <a href={url} download={fileName}>
              <RyogoOutlineButton label={t("Download")} className="w-full">
                <RyogoIcon icon={Download} size="sm" color="slate" />
              </RyogoOutlineButton>
            </a>
          </SectionColWrapper>
        )}
      </DialogContent>
    </Dialog>
  )
}
