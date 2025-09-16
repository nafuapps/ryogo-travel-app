//Layout for auth pages

import AuthMarketing from "./components/AuthMarketing"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div id="AuthLayout" className="grid grid-rows-1 grid-cols-1 md:grid-cols-2 w-screen h-screen">
    <AuthMarketing />
    <section id="AuthMainSection" className="bg-white w-full px-6 md:px-20 pt-20 pb-10">
      {children}
    </section>
  </div>
}