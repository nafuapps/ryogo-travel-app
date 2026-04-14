import Footer from "../components/footer"
import Navbar from "../components/nav"

export default function HowItWorksPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="howItWorks" />
      <div className="flex-1 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">About RyoGo</h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            RyoGo is revolutionizing the way people plan, book, and manage their
            travels. Our mission is to make travel accessible, affordable, and
            enjoyable for everyone.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-gray-700 mb-4">
              Founded in 2024, RyoGo was born from a simple idea: travel
              planning shouldnot be complicated. We set out to create a platform
              that brings together all the tools you need in one beautiful,
              easy-to-use interface.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              To democratize travel by providing innovative, user-friendly
              solutions that empower people to explore the world with
              confidence, affordability, and convenience.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Customer-first approach in everything we do</li>
              <li>Innovation and continuous improvement</li>
              <li>Transparency and trust</li>
              <li>Sustainability and social responsibility</li>
              <li>Diversity and inclusivity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-700">
              Have questions? We would love to hear from you!
              <br />
              Email: hello@ryogo.com
              <br />
              Phone: +1 (555) 123-4567
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  )
}
