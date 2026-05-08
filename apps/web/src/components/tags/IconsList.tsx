import { LucideIcon } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export function IconsList(props: { icons: LucideIcon[] }) {
  return (
    <div className="flex flex-row gap-1 lg:gap-1.5">
      {props.icons.map((Icon, index) => {
        return <RyogoIcon key={index} icon={Icon} size="sm" />
      })}
    </div>
  )
}
