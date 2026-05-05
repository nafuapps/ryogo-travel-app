export function LayoutWrapper({
  id,
  children,
}: {
  id: string
  children: React.ReactNode
}) {
  return (
    <main id={id} className="flex flex-row w-screen h-dvh">
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
    <section id={id} className="flex flex-row w-full h-dvh">
      {children}
    </section>
  )
}
