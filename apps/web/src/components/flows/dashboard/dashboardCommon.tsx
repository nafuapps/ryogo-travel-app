import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoCaption } from "@/components/typography"

export function DashboardLabelImageChip({
  label,
  children,
  end,
}: {
  label: string
  children: React.ReactNode
  end?: boolean
}) {
  return (
    <SectionRowWrapper center justifyEnd={end} reverse={end}>
      {children}
      <RyogoCaption color="slate">{label}</RyogoCaption>
    </SectionRowWrapper>
  )
}
