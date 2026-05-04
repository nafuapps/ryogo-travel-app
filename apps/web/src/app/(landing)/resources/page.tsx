import Footer from "@/components/landing/footer"
import Navbar from "@/components/landing/nav"

const resources = [
  {
    title: "Travel Guides",
    description:
      "Comprehensive guides to popular destinations around the world",
    icon: "📚",
  },
  {
    title: "Travel Tips",
    description: "Expert tips to help you travel smarter and save money",
    icon: "💡",
  },
  {
    title: "Blog",
    description: "Stories, insights, and updates from the RyoGo team",
    icon: "📝",
  },
  {
    title: "FAQ",
    description: "Answers to frequently asked questions about our platform",
    icon: "❓",
  },
  {
    title: "Support Center",
    description: "Get help with your account and bookings",
    icon: "🆘",
  },
  {
    title: "API Documentation",
    description: "Integrate RyoGo with your application",
    icon: "🔧",
  },
]

export default function ResourcesPage() {
  return (
    <div className="flex flex-col h-full">
      <Navbar selected="resources" />
      <div className="flex-1 max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Resources</h1>

        <p className="text-xl text-gray-600 mb-12">
          Explore our collection of resources to make the most of your travel
          experience
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow hover:shadow-lg transition border border-gray-200 p-6"
            >
              <div className="text-4xl mb-4">{resource.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {resource.title}
              </h3>
              <p className="text-gray-600">{resource.description}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 bg-linear-to-r from-sky-50 to-sky-400 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Learning Center
          </h2>
          <p className="text-gray-700 mb-6">
            Access our comprehensive learning materials to become a RyoGo
            expert. From video tutorials to detailed documentation, we have
            everything you need.
          </p>
          <button className="px-6 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition">
            Visit Learning Center
          </button>
        </section>
      </div>
      <Footer />
    </div>
  )
}
