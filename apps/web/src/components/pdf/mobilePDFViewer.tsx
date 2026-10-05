"use client"

import { usePDF, type DocumentProps } from "@react-pdf/renderer"

export default function MobilePDFViewer({
  document,
}: {
  document: React.ReactElement<DocumentProps>
}) {
  const [instance] = usePDF({ document })

  if (instance.loading)
    return <p style={{ padding: 20 }}>Generating layout...</p>
  if (instance.error)
    return <p style={{ padding: 20 }}>Error rendering preview.</p>
  if (!instance.url) return <p style={{ padding: 20 }}>Preparing preview...</p>

  return (
    <div
      style={{
        background: "#525659",
        width: "100%",
        height: "75vh",
        minHeight: 0,
        overflow: "hidden",
      }}
    >
      <iframe
        src={`${instance.url}#toolbar=1`}
        title="Invoice PDF"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </div>
  )
}
