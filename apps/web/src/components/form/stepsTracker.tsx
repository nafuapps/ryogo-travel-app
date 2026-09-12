export default function StepsTracker({
  current,
  steps,
}: {
  current: number
  steps: number
}) {
  if (current >= steps) {
    return (
      <div className="flex w-full h-1 lg:h-1.5 rounded-full bg-sky-700 dark:bg-sky-300" />
    )
  }
  return (
    <div className="flex flex-row items-center gap-2 w-full">
      {Array.from({ length: steps }, (_, index) => (
        <div
          key={index}
          className={`w-full h-1 lg:h-1.5 rounded-full ${
            index <= current
              ? "bg-slate-950 dark:bg-white"
              : "bg-slate-300 dark:bg-slate-700"
          }`}
        />
      ))}
    </div>
  )
}
