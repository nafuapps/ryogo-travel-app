import { RyogoSmall } from "@/components/typography"

type ConfirmValuesProps = {
  name: string
  value: string
}

export default function ConfirmValues({ name, value }: ConfirmValuesProps) {
  return (
    <div className="flex flex-row justify-between w-full gap-5 lg:gap-6">
      <RyogoSmall weight="font-bold">{name}</RyogoSmall>
      <div className="text-right">
        <RyogoSmall>{value}</RyogoSmall>
      </div>
    </div>
  )
}
