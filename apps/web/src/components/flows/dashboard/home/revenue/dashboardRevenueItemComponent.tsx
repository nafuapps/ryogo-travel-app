import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoSmall } from "@/components/typography"

export default function DashboardRevenueItemComponent(props: {
  label: string
  amount: number
}) {
  return (
    <SectionRowWrapper center>
      <RyogoSmall>{props.label}</RyogoSmall>
      <RyogoSmall>{"₹" + props.amount}</RyogoSmall>
    </SectionRowWrapper>
  )
}
