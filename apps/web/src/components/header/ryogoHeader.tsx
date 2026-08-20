import {
  HeaderLeftWrapper,
  HeaderRightWrapper,
  HeaderWrapper,
} from "@/components/header/headerWrappers"
import { RyogoP } from "@/components/typography"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { HeaderBackButton } from "./headerButton"

export default function RyogoHeader({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <HeaderWrapper>
      <HeaderLeftWrapper>
        <SidebarTrigger />
        <HeaderBackButton />
        <RyogoP weight="font-bold" color="slate">
          {title}
        </RyogoP>
      </HeaderLeftWrapper>
      <HeaderRightWrapper>{children}</HeaderRightWrapper>
    </HeaderWrapper>
  )
}
