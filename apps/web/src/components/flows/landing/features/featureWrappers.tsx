import { ScrollZoomIn } from "@/components/flows/landing/scrollZoomIn"
import { RyogoH4, RyogoSmall } from "@/components/typography"
import { VERCEL_BLOB_STORAGE_URL } from "@ryogo-travel-app/api/apiConfig"
import Image from "next/image"

export function FeatureGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
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
    <ScrollZoomIn
      className={`w-full group flex flex-col border p-5 lg:p-6 rounded-lg gap-4 lg:gap-5 ${long ? "md:flex-row md:col-span-2 md:items-center" : ""} ${longReverse ? "md:flex-row-reverse md:col-span-2 md:items-center" : ""} ${className ?? ""}`}
    >
      <div className="flex flex-col gap-3 lg:gap-4 w-full">
        <RyogoH4 weight="font-bold">{title}</RyogoH4>
        <RyogoSmall color="slate">{description}</RyogoSmall>
      </div>
      <div className="mt-auto w-full max-w-2xl relative rounded-xl aspect-4/3 overflow-hidden">
        <Image
          className="object-cover rounded-md md:transition-transform md:duration-300 md:group-hover:scale-105"
          loading="eager"
          src={VERCEL_BLOB_STORAGE_URL + src}
          alt={title}
          fill
          sizes="672px"
        />
      </div>
    </ScrollZoomIn>
  )
}
