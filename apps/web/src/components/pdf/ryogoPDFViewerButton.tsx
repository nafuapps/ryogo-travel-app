"use client"

import {
  RyogoBrandButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { SectionColWrapper } from "@/components/page/pageWrappers"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { DocumentProps, PDFViewer, usePDF } from "@react-pdf/renderer"
import { Download, Eye, SquareArrowOutUpRight } from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect } from "react"

export default function RyogoPDFViewerButton({
  document,
  fileName,
  label,
}: {
  document: React.ReactElement<DocumentProps>
  fileName: string
  label: string
}) {
  const t = useTranslations("Components.MobilePDFViewer")
  const [{ url }, updateDocument] = usePDF()

  useEffect(() => {
    updateDocument(document)
  }, [document, updateDocument])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <RyogoOutlineButton label={label}>
          <RyogoIcon icon={Eye} size="sm" color="slate" />
        </RyogoOutlineButton>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center justify-center size-5/6 p-4 lg:p-5">
        <PDFViewer className="w-full h-full gap-4">{document}</PDFViewer>
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
