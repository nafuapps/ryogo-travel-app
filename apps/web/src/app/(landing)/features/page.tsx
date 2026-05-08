//(Landing) Features page

import Footer from "@/components/flows/landing/footer"
import Navbar from "@/components/flows/landing/nav"

export default async function FeaturesPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="features" />
      <Footer />
    </div>
  )
}
