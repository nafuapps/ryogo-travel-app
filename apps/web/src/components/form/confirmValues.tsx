import { RyogoSmall } from "@/components/typography"

export default function ConfirmValues(props: { name: string; value: string }) {
  return (
    <div className="flex flex-row justify-between w-full gap-3 lg:gap-4 last:text-right pb-2 border-b">
      <RyogoSmall weight="font-bold">{props.name}</RyogoSmall>
      <RyogoSmall>{props.value}</RyogoSmall>
    </div>
  )
}
