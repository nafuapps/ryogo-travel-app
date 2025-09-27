//Layout for auth pages

import AuthMarketing from "./components/authMarketing";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section id="AuthLayout" className="flex flex-row w-screen h-screen">
      <AuthMarketing />
      <div
        id="AuthMainSection"
        className="flex bg-white w-full h-full md:h-full md:w-1/2 px-6 md:px-8 lg:px-10 py-10 lg:py-12"
      >
        {children}
      </div>
    </section>
  );
}
