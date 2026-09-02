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
        className={"dark:hidden"}
      />
      <Image
        loading="eager"
        src="/logoLight.png"
        fill
        alt={"Logo for Ryogo - Travel Agency App"}
        sizes="(max-width: 768px) 160px, 192px"
        className={"hidden dark:block"}
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
        className={"dark:hidden"}
      />
      <Image
        loading="eager"
        src="/logo.png"
        fill
        alt={"Logo for Ryogo - Travel Agency App"}
        sizes="(max-width: 768px) 112px, 128px"
        className={"hidden dark:block"}
      />
    </div>
  )
}

export function RyoGoLandingLogo({ alt }: { alt: string }) {
  return (
    <div className="relative w-16 md:w-18 lg:w-20 aspect-2/1">
      <Image
        loading="eager"
        src="/logo.png"
        fill
        alt={alt}
        sizes="(max-width: 768px) 64px, (max-width: 1024px) 72px, 80px"
        className={"dark:hidden"}
      />
      <Image
        loading="eager"
        src="/logoLight.png"
        fill
        alt={alt}
        sizes="(max-width: 768px) 64px, (max-width: 1024px) 72px, 80px"
        className={"hidden dark:block"}
      />
    </div>
  )
}

export function RyoGoSidebarLogo({ open }: { open: boolean }) {
  return (
    <div
      className={` ${open ? "py-2.5" : "py-3"} px-1 flex gap-3 items-center`}
    >
      <div className={`relative size-10 aspect-square`}>
        <Image
          loading="eager"
          src="/logoPWA.png"
          fill
          alt={"Logo Icon for Ryogo - Travel Agency App"}
          sizes="40px"
          className={"dark:hidden"}
        />
        <Image
          loading="eager"
          src="/logoPWALight.png"
          fill
          alt={"Logo Icon for Ryogo - Travel Agency App"}
          sizes="40px"
          className={"hidden dark:block"}
        />
      </div>
      <div className={`relative h-11 ${open ? "flex" : "hidden"} aspect-2/1`}>
        <Image
          loading="eager"
          src="/logo.png"
          fill
          alt={"Expanded Logo for Ryogo - Travel Agency App"}
          sizes="110px"
          className={"dark:hidden"}
        />
        <Image
          loading="eager"
          src="/logoLight.png"
          fill
          alt={"Expanded Logo for Ryogo - Travel Agency App"}
          sizes="110px"
          className={"hidden dark:block"}
        />
      </div>
    </div>
  )
}
