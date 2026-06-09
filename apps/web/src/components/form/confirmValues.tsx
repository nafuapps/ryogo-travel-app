import { RyogoSmall } from "@/components/typography"

type ConfirmValuesProps = {
  name: string
  value: string
}

export default function ConfirmValues({ name, value }: ConfirmValuesProps) {
  return (
    <div className="flex flex-row justify-between w-full gap-3 lg:gap-4 last:text-right pb-2 border-b">
      <RyogoSmall weight="font-bold">{name}</RyogoSmall>
      <RyogoSmall>{value}</RyogoSmall>
    </div>
  )
}
