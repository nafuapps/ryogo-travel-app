export function LayoutWrapper({
  id,
  children,
  screen,
}: {
  id: string
  children: React.ReactNode
  screen?: boolean
}) {
  return (
    <main
      id={id}
      className={`flex ${screen ? "w-screen h-dvh flex-row" : "h-full flex-col"} bg-white dark:bg-slate-800`}
    >
      {children}
    </main>
  )
}

export function LayoutSectionWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="flex min-h-0 min-w-0 flex-col w-full h-dvh">
      {children}
    </section>
  )
}
