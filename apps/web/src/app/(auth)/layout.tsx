//Layout for auth pages

import AuthMarketing from "./components/authMarketing"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <section id="AuthLayout" className="flex flex-row w-screen h-screen">
    <AuthMarketing />
    <div id="AuthMainSection" className="flex bg-white w-full h-full md:h-full md:w-1/2 px-6 md:px-10 lg:px-20 pt-16 pb-10">
      {children}
    </div>
  </section>
}