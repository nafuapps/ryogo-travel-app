import { RyogoCaption, RyogoP } from "@/components/typography"
import { RyogoVideo } from "@/components/video/ryogoVideo"
import { SectionWrapper } from "@/components/page/pageWrappers"

export type SupportVideoItemType = {
  src: string
  title: string
  desc: string
}

export function SupportVideoItem({
  src,
  title,
  desc,
  index,
}: SupportVideoItemType & { index: number }) {
  return (
    <SectionWrapper id={title}>
      <div className="flex gap-1.5 md:gap-2 items-center">
        <div className="flex items-center justify-center bg-slate-50 dark:bg-slate-950 rounded-lg size-8 lg:size-10 shrink-0">
          <RyogoP color="slate" weight="font-bold">
            {index}
          </RyogoP>
        </div>
        <RyogoP weight="font-bold">{title}</RyogoP>
      </div>
      <RyogoCaption color="light">{desc}</RyogoCaption>
      <RyogoVideo src={src} className="w-full aspect-video rounded-lg" />
    </SectionWrapper>
  )
}
