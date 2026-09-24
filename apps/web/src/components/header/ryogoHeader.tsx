import { RyogoSmall } from "@/components/typography"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HeaderBackButton } from "./headerButton"
import {
  HeaderWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"

export default function RyogoHeader({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <HeaderWrapper>
      <SectionRowWrapper small className="items-center justify-start">
        <SidebarTrigger />
        <HeaderBackButton />
        <RyogoSmall weight="font-bold" color="slate">
          {title}
        </RyogoSmall>
      </SectionRowWrapper>
      <SectionRowWrapper className="items-center justify-end">
        {children}
      </SectionRowWrapper>
    </HeaderWrapper>
  )
}
