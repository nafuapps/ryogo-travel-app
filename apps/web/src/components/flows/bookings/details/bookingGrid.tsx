export default function BookingGrid({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="gap-3 md:gap-4 columns-1 lg:columns-2">{children}</div>
}
