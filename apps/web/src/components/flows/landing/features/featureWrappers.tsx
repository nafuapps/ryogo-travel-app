import { RyogoSmall, RyogoH4 } from "@/components/typography"
import Image from "next/image"

export function FeatureGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
      {children}
    </div>
  )
}

export function FeatureItem({
  title,
  description,
  src,
  className,
  long,
  longReverse,
}: {
  title: string
  description: string
  src: string
  className?: string
  long?: boolean
  longReverse?: boolean
}) {
  return (
    <div
      className={`w-full group flex flex-col ${long ? "md:flex-row md:col-span-2 md:items-center" : ""} ${longReverse ? "md:flex-row-reverse md:col-span-2 md:items-center" : ""} border rounded-2xl p-5 md:p-6 bg-white gap-6 lg:gap-8 ${className ?? ""}`}
    >
      <div className="flex flex-col gap-3 lg:gap-4 w-full">
        <RyogoH4 weight="font-bold">{title}</RyogoH4>
        <RyogoSmall color="slate">{description}</RyogoSmall>
      </div>
      <div className="border-8 md:border-10 mt-auto border-slate-50/50 w-full max-w-2xl relative rounded-xl aspect-video overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <Image
          className="object-cover"
          loading="eager"
          src={src}
          alt=""
          fill
          sizes="672px"
        />
      </div>
    </div>
  )
}
