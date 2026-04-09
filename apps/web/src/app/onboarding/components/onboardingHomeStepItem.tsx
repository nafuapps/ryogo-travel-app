import { SmallGrey } from "@/components/typography"
import { LucideIcon } from "lucide-react"

interface OnboardingHomeStepItemProps {
  icon: LucideIcon
  label: string
}

export default function OnboardingHomeStepItem(
  props: OnboardingHomeStepItemProps,
) {
  return (
    <div className="flex flex-row gap-3 md:gap-4 justify-start items-center">
      <div className="flex flex-col items-center">
        <div className="w-1 h-2 md:h-3 bg-slate-100"></div>
        <div className="bg-slate-100 rounded-full size-10 md:size-12 flex justify-center items-center shrink-0">
          <props.icon className="text-slate-500 size-4 md:size-5" />
        </div>
        <div className="w-1 h-2 md:h-3 bg-slate-100"></div>
      </div>
      <SmallGrey>{props.label}</SmallGrey>
    </div>
  )
}
