import {
  // RyogoGhostButton,
  RyogoOutlineButton,
} from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { CircleQuestionMark } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"

export function HelpIconButton({
  label,
  showLabelSmall,
  ...props
}: React.ComponentProps<typeof Link> & {
  label?: string
  showLabelSmall?: boolean
}) {
  const t = useTranslations("Help")
  return (
    <Link {...props} className="mt-auto">
      <RyogoOutlineButton
        label={label ?? t("Title")}
        labelColor="light"
        className="px-2 w-full"
        type="button"
        labelClassName={`${showLabelSmall ? "" : "hidden lg:block"}`}
      >
        <RyogoIcon icon={CircleQuestionMark} size="sm" color="light" />
      </RyogoOutlineButton>
    </Link>
  )
}

// export function HelpTextButton({
//   href,
//   label,
// }: {
//   href: React.ComponentProps<typeof Link>["href"]
//   label?: string
// }) {
//   const t = useTranslations("Help")
//   return (
//     <Link href={href}>
//       <RyogoGhostButton label={label ?? t("Title")} />
//     </Link>
//   )
// }
