import { Small, SmallBold } from "@/components/typography"

type ConfirmValuesProps = {
  name: string
  value: string
}

export default function ConfirmValues({ name, value }: ConfirmValuesProps) {
  return (
    <div className="flex flex-row justify-between w-full gap-5 lg:gap-6">
      <SmallBold>{name}</SmallBold>
      <div className="text-right">
        <Small>{value}</Small>
      </div>
    </div>
  )
}
