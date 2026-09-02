import { RyogoP, RyogoSmall } from "@/components/typography"
import { DashboardChipItemWrapper } from "@/components/flows/dashboard/dashboardCommon"

export default function DashboardRevenueItemComponent({
  label,
  amount,
}: {
  label: string
  amount: number
}) {
  return (
    <DashboardChipItemWrapper>
      <RyogoSmall color="slate">{label}</RyogoSmall>
      <RyogoP>{"₹" + amount}</RyogoP>
    </DashboardChipItemWrapper>
  )
}
