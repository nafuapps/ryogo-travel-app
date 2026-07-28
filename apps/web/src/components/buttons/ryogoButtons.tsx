import { ChevronRight } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoCaption } from "@/components/typography"
import { Button } from "@/components/ui/button"

export function RyogoIconButton({ label }: { label: string }) {
  return (
    <Button variant="secondary">
      <RyogoCaption color="slate" className="hidden lg:flex">
        {label}
      </RyogoCaption>
      <RyogoIcon icon={ChevronRight} size="sm" color="slate" />
    </Button>
  )
}
