export default function BookingActionWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 mt-auto border rounded-lg p-2 lg:p-3 empty:hidden">
      {children}
    </div>
  )
}
