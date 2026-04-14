import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Sarah Anderson",
    role: "Travel Enthusiast",
    content:
      "RyoGo made booking my last vacation so easy! The entire process was seamless and I got great deals on all my bookings.",
    avatar: "SA",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Business Traveler",
    content:
      "As someone who travels frequently for work, the VIP support has been invaluable. They truly understand my needs.",
    avatar: "MC",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "Adventure Seeker",
    content:
      "The best travel platform I've used! Great prices, excellent customer service, and an intuitive interface.",
    avatar: "ER",
    rating: 5,
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24 px-4 md:px-6 lg:px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied travelers who have made their journeys
            with RyoGo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ⭐
                    </span>
                  ))}
                </div>

                <p className="text-gray-700 mb-6 italic">
                  {testimonial.content}
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
