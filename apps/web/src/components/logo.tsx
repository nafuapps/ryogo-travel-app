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

export function RyoGoLightLogo() {
  return (
    <div className="relative w-28 md:w-32 aspect-2/1">
      <Image
        loading="eager"
        src="/logoLight.png"
        fill
        alt={"Logo for Ryogo - Travel Agency App"}
        sizes="(max-width: 768px) 112px, 128px"
      />
    </div>
  )
}

export function RyoGoLandingLogo(props: { alt: string }) {
  return (
    <div className="relative w-16 md:w-20 aspect-2/1">
      <Image
        loading="eager"
        src="/logo.png"
        fill
        alt={props.alt}
        sizes="(max-width: 768px) 64px, 80px"
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
