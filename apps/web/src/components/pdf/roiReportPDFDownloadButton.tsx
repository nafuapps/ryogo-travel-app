"use client"

import { RyogoBrandButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import getROIReportPDF from "@/components/pdf/getROIReportPDF"
import { ROIReportType } from "@ryogo-travel-app/api/types/agency.types"
import { Download } from "lucide-react"

export default function ROIReportPDFDownloadButton({
  label,
  report,
}: {
  label: string
  report: ROIReportType
}) {
  function downloadReportPDF() {
    getROIReportPDF(report).then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${label}.pdf`
      a.click()
      window.URL.revokeObjectURL(url)
    })
  }
  return (
    <RyogoBrandButton
      size="lg"
      label={label}
      onClick={() => downloadReportPDF()}
      className="w-full"
    >
      <RyogoIcon icon={Download} size="sm" color="white" thick />
    </RyogoBrandButton>
  )
}
