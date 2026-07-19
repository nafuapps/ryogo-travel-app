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
    <div className="relative w-16 md:w-18 lg:w-20 aspect-2/1">
      <Image
        loading="eager"
        src="/logo.png"
        fill
        alt={props.alt}
        sizes="(max-width: 768px) 64px, (max-width: 1024px) 72px, 80px"
      />
    </div>
  )
}

interface RyogoSidebarLogoProps {
  open: boolean
}
export function RyoGoSidebarLogo(props: RyogoSidebarLogoProps) {
  return (
    <div
      className={` ${props.open ? "py-3" : "py-4"} px-2 flex gap-3 items-center`}
    >
      <div className={`relative size-7 lg:size-8 aspect-square`}>
        <Image
          loading="eager"
          src="/logoPWA.png"
          fill
          alt={"Logo Icon for Ryogo - Travel Agency App"}
          sizes="100%"
        />
      </div>
      <div
        className={`relative h-9 lg:h-10 ${props.open ? "flex" : "hidden"} aspect-2/1`}
      >
        <Image
          loading="eager"
          src="/logo.png"
          fill
          alt={"Expanded Logo for Ryogo - Travel Agency App"}
          sizes="100%"
        />
      </div>
    </div>
  )
}
