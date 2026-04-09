import Image from "next/image"

export function SidebarLogoItem(props: { open: boolean; logo: string }) {
  return (
    <div className="flex flex-row gap-3 items-center justify-start rounded text-slate-600 w-full p-1">
      <div
        className={`flex relative aspect-2/1 ${props.open ? "w-56" : "w-12"}`}
      >
        <Image src="/logo.png" fill={true} alt={props.logo} />
      </div>
    </div>
  )
}
