"use client"

import { usePDF, type DocumentProps } from "@react-pdf/renderer"
import { useTranslations } from "next-intl"
// import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"

export default function MobilePDFViewer({
  document,
}: {
  document: React.ReactElement<DocumentProps>
}) {
  const t = useTranslations("Components.MobilePDFViewer")
  const [instance] = usePDF({ document })

  if (instance.loading) return <p style={{ padding: 20 }}>{t("Generating")}</p>
  if (instance.error) return <p style={{ padding: 20 }}>{t("Error")}</p>

  // const openPdf = () => {
  //   if (!instance.url) return
  //   window.open(instance.url, "_blank", "noopener,noreferrer")
  // }

  return (
    <div className="flex items-center justify-center">
      <embed
        src={`${instance.url}#toolbar=1`}
        title="Invoice PDF"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
      {/* <RyogoBrandButton onClick={openPdf} label={t("Open")} /> */}
    </div>
  )
}
