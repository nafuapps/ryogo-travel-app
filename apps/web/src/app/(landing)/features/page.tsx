//(Landing) Features page

import Footer from "../components/footer"
import Navbar from "../components/nav"

export default async function FeaturesPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="features" />
      <Footer />
    </div>
  )
}
