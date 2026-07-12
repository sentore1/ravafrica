import {
  Award,
  Heart,
  MapPin,
  Shield,
  TreePine,
  Users,
  Star,
  Globe,
} from "lucide-react";

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1920&q=80"
            alt="African landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <span className="inline-block text-[hsl(20,73%,49%)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            About Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Story
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            Crafting unforgettable East African safari experiences since 2009
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block text-[hsl(20,73%,49%)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
                Who We Are
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-[hsl(30,8%,13%)] mb-6">
                RovAfrika Safari Tours
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Founded in Kigali, Rwanda, RovAfrika Safari Tours has grown from a
                small local operator to one of East Africa&apos;s most trusted names in
                premium safari experiences. We specialize in multi-country
                itineraries that showcase the incredible diversity of Rwanda,
                Uganda, Kenya, and Tanzania.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                Our team of experienced guides, wildlife experts, and travel
                consultants work together to create personalized journeys that go
                beyond the ordinary. Whether you&apos;re tracking gorillas in the
                misty mountains or witnessing the Great Migration across the
                Serengeti, we ensure every moment is extraordinary.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-[hsl(20,20%,97%)] rounded-xl">
                  <div className="text-3xl font-bold text-[hsl(357,52%,16%)] mb-1">
                    15+
                  </div>
                  <div className="text-sm text-gray-500">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-[hsl(20,20%,97%)] rounded-xl">
                  <div className="text-3xl font-bold text-[hsl(357,52%,16%)] mb-1">
                    2,500+
                  </div>
                  <div className="text-sm text-gray-500">Happy Travelers</div>
                </div>
                <div className="text-center p-4 bg-[hsl(20,20%,97%)] rounded-xl">
                  <div className="text-3xl font-bold text-[hsl(357,52%,16%)] mb-1">
                    5
                  </div>
                  <div className="text-sm text-gray-500">Countries</div>
                </div>
                <div className="text-center p-4 bg-[hsl(20,20%,97%)] rounded-xl">
                  <div className="text-3xl font-bold text-[hsl(357,52%,16%)] mb-1">
                    4.9/5
                  </div>
                  <div className="text-sm text-gray-500">Average Rating</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80"
                alt="Safari experience"
                className="rounded-2xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-[hsl(357,52%,16%)] text-white p-6 rounded-2xl shadow-xl">
                <div className="text-2xl font-bold mb-1">Since 2009</div>
                <div className="text-white/70 text-sm">
                  Creating memories across East Africa
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-[hsl(30,8%,13%)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block text-[hsl(20,73%,49%)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
              Our Values
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              What Sets Us Apart
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8" />,
                title: "Safety First",
                desc: "Licensed, insured, and with emergency protocols at every destination",
              },
              {
                icon: <Heart className="w-8 h-8" />,
                title: "Responsible Tourism",
                desc: "We support local communities and conservation efforts in every country we operate",
              },
              {
                icon: <TreePine className="w-8 h-8" />,
                title: "Eco-Friendly",
                desc: "Carbon-offset programs, eco-lodges, and sustainable practices throughout",
              },
              {
                icon: <Award className="w-8 h-8" />,
                title: "Expert Guides",
                desc: "Certified local guides with deep knowledge of wildlife, culture, and terrain",
              },
            ].map((v, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center mx-auto mb-4 text-white">
                  {v.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


    </>
  );
}
