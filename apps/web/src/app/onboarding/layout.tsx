//Layout page for onboarding pages

export default function OnboardingHomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section id="OnboardingMainLayout" className="flex flex-row w-screen h-screen">
    {children}
  </section>
} 