import { Star, Quote } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  avatar: string;
  rating: number;
  text: string;
  tour: string;
}

interface TrustStat {
  value: string;
  label: string;
}

interface Partner {
  name: string;
}

export default function TrustIndicators({ 
  testimonials, 
  stats, 
  partners 
}: { 
  testimonials: Testimonial[]; 
  stats: TrustStat[]; 
  partners: Partner[];
}) {
  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-[hsla(0, 0%, 0%, 1.00)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(150,20%,10%)] mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Join thousands of satisfied travelers who&apos;ve experienced the magic of
            East Africa with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-[hsl(40,20%,97%)] rounded-2xl p-8 relative group hover:shadow-lg transition-shadow"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[hsl(20,73%,49%)]/20" />
              <div className="flex items-center gap-4 mb-6">
                <div>
                  <div className="font-semibold text-[hsl(150,20%,10%)]">
                    {t.name}
                  </div>
                  <div className="text-sm text-gray-500">{t.location}</div>
                </div>
              </div>
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-white text-white"
                  />
                ))}
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="text-xs font-medium text-[hsl(152,45%,25%)] uppercase tracking-wider">
                {t.tour}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
