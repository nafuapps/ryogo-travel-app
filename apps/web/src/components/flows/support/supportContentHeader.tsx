import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { SectionRowWrapper } from "@/components/page/pageWrappers"
import { RyogoP, RyogoSmall } from "@/components/typography"
import { LucideIcon } from "lucide-react"

export default function SupportContentHeader({
  icon,
  title,
}: {
  icon: LucideIcon
  title: string
}) {
  return (
    <SectionRowWrapper justifyStart center>
      <RyogoEnclosedIcon
        icon={icon}
        size="sm"
        color="slate"
        bgColor="light"
        thick
      />
      <RyogoP color="dark" weight="font-bold">
        {title}
      </RyogoP>
    </SectionRowWrapper>
  )
}

export function SupportContentSectionWrapper({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <>
      <RyogoSmall color="dark" weight="font-bold" className="mt-2">
        {title}
      </RyogoSmall>
      {children}
    </>
  )
}
