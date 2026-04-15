export function H1({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-medium md:text-4xl lg:text-5xl text-slate-800">
      {children}
    </h1>
  )
}

export function H1Brand({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-medium md:text-4xl lg:text-5xl text-sky-700">
      {children}
    </h1>
  )
}

export function H1Light({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-3xl font-medium md:text-4xl lg:text-5xl text-white">
      {children}
    </h1>
  )
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold lg:text-4xl text-slate-800">
      {children}
    </h2>
  )
}

export function H2Light({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold lg:text-4xl text-white">
      {children}
    </h2>
  )
}

export function H2Brand({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold lg:text-4xl text-sky-700">
      {children}
    </h2>
  )
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl md:text-2xl font-semibold lg:text-3xl text-slate-800">
      {children}
    </h3>
  )
}

export function H3Brand({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl md:text-2xl font-semibold lg:text-3xl text-sky-700">
      {children}
    </h3>
  )
}

export function H3Grey({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xl md:text-2xl font-medium lg:text-3xl text-slate-500">
      {children}
    </h3>
  )
}

export function H4({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xl font-semibold lg:text-2xl text-slate-800">
      {children}
    </h4>
  )
}

export function H4Brand({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xl font-semibold lg:text-2xl text-sky-700">
      {children}
    </h4>
  )
}

export function H4Grey({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xl font-medium lg:text-2xl text-slate-500">
      {children}
    </h4>
  )
}

export function H5({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-lg font-medium lg:text-xl text-slate-800">
      {children}
    </h5>
  )
}

export function H5Brand({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-lg font-medium lg:text-xl text-sky-700">{children}</h5>
  )
}

export function H5Grey({ children }: { children: React.ReactNode }) {
  return (
    <h5 className="text-lg font-medium lg:text-xl text-slate-500">
      {children}
    </h5>
  )
}

export function PBold({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base lg:text-lg font-bold text-slate-900">{children}</p>
  )
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="text-base lg:text-lg text-slate-800">{children}</p>
}

export function PBrand({ children }: { children: React.ReactNode }) {
  return <p className="text-base lg:text-lg text-sky-700">{children}</p>
}

export function PLight({ children }: { children: React.ReactNode }) {
  return <p className="text-base lg:text-lg text-slate-100">{children}</p>
}

export function PRed({ children }: { children: React.ReactNode }) {
  return <p className="text-base lg:text-lg text-red-400">{children}</p>
}

export function PGrey({ children }: { children: React.ReactNode }) {
  return <p className="text-base lg:text-lg text-slate-500">{children}</p>
}

export function SmallBold({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm font-bold lg:text-base text-slate-900">
      {children}
    </small>
  )
}

export function Small({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm lg:text-base text-slate-800">{children}</small>
  )
}

export function SmallBrand({ children }: { children: React.ReactNode }) {
  return <small className="text-sm lg:text-base text-sky-700">{children}</small>
}

export function SmallRed({ children }: { children: React.ReactNode }) {
  return <small className="text-sm text-red-400 lg:text-base">{children}</small>
}

export function SmallGrey({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm lg:text-base text-slate-500">{children}</small>
  )
}

export function SmallLight({ children }: { children: React.ReactNode }) {
  return (
    <small className="text-sm lg:text-base text-slate-100">{children}</small>
  )
}

export function CaptionBold({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs font-bold lg:text-sm text-slate-800">
      {children}
    </span>
  )
}

export function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-xs lg:text-sm text-slate-700">{children}</span>
}

export function CaptionBrand({ children }: { children: React.ReactNode }) {
  return <span className="text-xs lg:text-sm text-sky-700">{children}</span>
}

export function CaptionLight({ children }: { children: React.ReactNode }) {
  return <span className="text-xs lg:text-sm text-slate-300">{children}</span>
}

export function CaptionRed({ children }: { children: React.ReactNode }) {
  return <span className="text-xs lg:text-sm text-red-400">{children}</span>
}

export function CaptionGrey({ children }: { children: React.ReactNode }) {
  return <span className="text-xs lg:text-sm text-slate-500">{children}</span>
}
