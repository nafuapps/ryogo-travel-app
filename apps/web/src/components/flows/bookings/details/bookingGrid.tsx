export default function BookingGrid({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-3 md:gap-4 grid-cols-1 lg:grid-cols-2">
      {children}
    </div>
  )
}
