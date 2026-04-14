import { SmallGrey } from "@/components/typography"
import { LucideIcon } from "lucide-react"

interface OnboardingHomeStepItemProps {
  icon: LucideIcon
  label: string
}

export default function OnboardingHomeDocumentItem(
  props: OnboardingHomeStepItemProps,
) {
  return (
    <div className="flex flex-row gap-3 md:gap-4 justify-start items-center">
      <div className="bg-sky-700 rounded-lg size-10 md:size-12 flex justify-center items-center shrink-0">
        <props.icon className="text-sky-50 size-4 md:size-5" />
      </div>
      <SmallGrey>{props.label}</SmallGrey>
    </div>
  )
}
