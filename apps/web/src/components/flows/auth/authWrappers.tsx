import Image from "next/image"
import Link from "next/link"
import RyoGoLogo from "@/components/logo"

export function AuthMainWrapper({
  children,
  src,
}: {
  children: React.ReactNode
  src?: string
}) {
  return (
    <div className="relative flex flex-col gap-10 md:gap-12 min-h-full overflow-scroll no-scrollbar items-center bg-slate-50 dark:bg-slate-900 w-full md:w-1/2 p-6 md:p-8 lg:p-10">
      {src ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 md:hidden" />
        </>
      ) : null}
      <div className="z-10 flex w-full h-full flex-col items-center gap-10 md:gap-12">
        <Link href="/">
          <RyoGoLogo />
        </Link>
        {children}
      </div>
    </div>
  )
}

export function AuthSideWrapper({ children }: { children: React.ReactNode }) {
  return <div className="relative hidden md:flex md:w-1/2">{children}</div>
}

export function AuthPageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col justify-center w-full rounded-lg shadow bg-white dark:bg-slate-800 p-6 md:p-8 gap-3 lg:gap-4">
      {children}
    </div>
  )
}

export function AuthAccountsWrapper({
  length,
  children,
}: {
  length: number
  children: React.ReactNode
}) {
  return (
    <div
      className={`grid grid-cols-1 ${length > 3 ? "lg:grid-cols-2" : ""} gap-2 lg:gap-3 overflow-y-scroll no-scrollbar`}
    >
      {children}
    </div>
  )
}

export function AuthImage({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      loading="eager"
      src={src}
      alt={alt}
      className="object-cover"
      fill
      sizes="(min-width: 768px) 50vw"
    />
  )
}
