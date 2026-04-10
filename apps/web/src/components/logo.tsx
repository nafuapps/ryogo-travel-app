import Image from "next/image"

export default function RyoGoLogo() {
  return (
    <div className="relative w-40 md:w-48 aspect-2/1">
      <Image
        loading="eager"
        src="/logo.png"
        fill
        alt={"Logo for Ryogo - Travel Agency App"}
        sizes="(max-width: 768px) 160px, 192px"
      />
    </div>
  )
}

interface RyogoSidebarLogoProps {
  open: boolean
}
export function RyoGoSidebarLogo(props: RyogoSidebarLogoProps) {
  return (
    <div className={`relative ${props.open ? "w-1/2" : "w-full"} aspect-2/1`}>
      <Image
        loading="eager"
        src="/logo.png"
        fill
        alt={"Logo for Ryogo - Travel Agency App"}
        sizes="100%"
      />
    </div>
  )
}
