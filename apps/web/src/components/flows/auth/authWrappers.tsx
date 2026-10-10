import Image from "next/image"

export function AuthMainWrapper({
  children,
  src,
}: {
  children: React.ReactNode
  src?: string
}) {
  return (
    <div className="relative flex flex-col gap-8 md:gap-10 min-h-full overflow-scroll no-scrollbar items-center bg-slate-50 dark:bg-slate-900 w-full md:w-1/2 p-6 md:p-8 lg:p-10">
      {src ? (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
            style={{ backgroundImage: `url(${src})` }}
          />
          <div className="absolute inset-0 bg-white/70 dark:bg-slate-800/70 md:hidden" />
        </>
      ) : null}
      <div className="z-10 flex w-full h-full flex-col items-center justify-between gap-6 md:gap-8 pt-16 md:pt-20 pb-4 md:pb-5">
        {children}
      </div>
    </div>
  )
}

export function AuthSideWrapper({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative hidden md:flex md:w-1/2">
      <AuthImage src={src} alt={alt} />
    </div>
  )
}

export function AuthPageWrapper({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      id="authPage"
      className={`flex flex-col justify-center my-auto animate-zoom-in w-full rounded-lg shadow bg-white dark:bg-slate-800 p-6 md:p-8 gap-3 lg:gap-4 ${className ?? ""}`}
    >
      {children}
    </div>
  )
}

function AuthImage({ src, alt }: { src: string; alt: string }) {
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
