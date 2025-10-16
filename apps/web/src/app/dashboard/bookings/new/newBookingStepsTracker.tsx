type NewBookingStepsProps = {
  total: number;
  current: number;
};
export default function NewBookingStepsTracker({
  total,
  current,
}: NewBookingStepsProps) {
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
  );
}
