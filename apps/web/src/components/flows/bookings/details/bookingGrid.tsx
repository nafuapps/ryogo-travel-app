export default function BookingGrid({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
    <div className="gap-3 md:gap-4 columns-1 lg:columns-2 2xl:columns-3 ">
      {children}
    </div>
  )
}
