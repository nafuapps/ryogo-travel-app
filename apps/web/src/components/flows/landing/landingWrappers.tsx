export function LandingSectionWrapper({
  id,
  children,
  className,
  hero,
}: {
  id: string
  children: React.ReactNode
  className?: string
  hero?: boolean
}) {
  return (
    <section
      id={id}
      className={`${hero ? "h-lvh p-4 md:p-5 lg:p-6" : "py-24 md:py-32 px-5 md:px-6 lg:px-8"} ${className}`}
    >
      {children}
    </section>
  )
}

export function LandingContentWrapper({
  children,
  className,
  justifyStart,
}: {
  children: React.ReactNode
  className?: string
  justifyStart?: boolean
}) {
  return (
    <div
      className={`max-w-6xl flex flex-col items-center ${justifyStart ? "justify-start" : "justify-center"} mx-auto gap-6 md:gap-8 ${className}`}
    >
      {children}
    </div>
  )
}
