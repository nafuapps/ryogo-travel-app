export function HeaderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        "flex flex-row gap-3 lg:gap-4 pb-3 lg:pb-4 justify-between items-center border-b border-slate-200"
      }
    >
      {children}
    </div>
  )
}

export function HeaderLeftWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className={"flex flex-row gap-2 lg:gap-3 items-center"}>
      {children}
    </div>
  )
}
export function HeaderRightWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={"flex flex-row gap-3 lg:gap-4 justify-end items-center"}>
      {children}
    </div>
  )
}
