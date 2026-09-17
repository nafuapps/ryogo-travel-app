import { SectionColWrapper } from "@/components/page/pageWrappers"

export default function BookingActionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SectionColWrapper className="mt-auto border rounded-md p-2 lg:p-3 empty:hidden">
      {children}
    </SectionColWrapper>
  )
}
