import { RyogoCaption } from "@/components/typography"
import Link from "next/link"

export type SupportRelatedArticleType = {
  href: React.ComponentProps<typeof Link>["href"]
  label: string
}

export default function SupportRelatedArticleLinkButton({
  href,
  label,
}: SupportRelatedArticleType) {
  return (
    <Link href={href} className="my-1 hover:underline">
      <RyogoCaption color="slate">{label}</RyogoCaption>
    </Link>
  )
}
