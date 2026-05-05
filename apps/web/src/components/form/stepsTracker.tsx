export const NewBookingTotalSteps = 5
export const NewVehicleTotalSteps = 5
export const NewDriverTotalSteps = 4
export const NewAgentTotalSteps = 1

export default function StepsTracker({
  total,
  current,
}: {
  total: number
  current: number
}) {
  return (
    <div className="flex flex-row items-center gap-2 w-full">
      {Array.from({ length: total }, (_, index) => (
        <div
          key={index}
          className={`w-full h-1 lg:h-1.5 rounded-full ${
            index <= current ? "bg-slate-950" : "bg-slate-200"
          }`}
        />
      ))}
    </div>
  )
}
