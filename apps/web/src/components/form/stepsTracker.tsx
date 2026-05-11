export default function StepsTracker({
  current,
  steps,
}: {
  current: number
  steps:
    | "booking"
    | "vehicle"
    | "driver"
    | "agent"
    | "account"
    | "verify"
    | number
}) {
  let total = 1
  if (typeof steps !== "number") {
    if (steps === "account") total = 5
    if (steps === "booking") total = 5
    if (steps === "vehicle") total = 5
    if (steps === "driver") total = 4
    if (steps === "agent") total = 2
    if (steps === "verify") total = 1
  } else {
    total = steps
  }
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
