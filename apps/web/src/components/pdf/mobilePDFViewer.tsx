"use client"

import { PDFDownloadLink, type DocumentProps } from "@react-pdf/renderer"
import { useTranslations } from "next-intl"
import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"

export default function MobilePDFViewer({
  document,
  name,
}: {
  document: React.ReactElement<DocumentProps>
  name: string
}) {
  const t = useTranslations("Components.MobilePDFViewer")
  return (
    <PDFDownloadLink
      document={document}
      fileName={name}
      className="w-full h-full flex items-center justify-center"
    >
      <RyogoBrandButton label={t("Download")} />
    </PDFDownloadLink>
  )
}
