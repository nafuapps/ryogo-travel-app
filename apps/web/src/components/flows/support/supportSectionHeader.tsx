import { RyogoH3, RyogoSmall } from "@/components/typography"

export default function SupportSectionHeader({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <>
      <RyogoH3 weight="font-bold" className="mx-auto text-center mt-4 lg:mt-5">
        {title}
      </RyogoH3>
      <RyogoSmall color="light" className="mx-auto text-center mb-4 lg:mb-5">
        {description}
      </RyogoSmall>
    </>
  )
}
