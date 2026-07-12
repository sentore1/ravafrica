"use client";

import { ArrowRight, Clock, MapPin, Star, Users } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

interface Tour {
  id: string;
  title: string;
  slug: string;
  countries: string[];
  duration: string;
  group_size: string;
  rating: number;
  reviews_count: number;
  price: number;
  image: string;
  highlights: string[];
  featured: boolean;
}

export default function FeaturedTours({ tours }: { tours: Tour[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 380;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 md:py-28 bg-white" id="tours">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div>
            <span className="inline-block text-[hsl(357,52%,16%)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            </span>
            <h2 className="text-2xl md:text-2xl lg:text-5xl font-bold text-[hsl(150,20%,10%)] mb-3">
              Curated Safari Experiences
            </h2>
            <p className="text-gray-600 max-w-xl text-l">
              Expertly crafted multi-country itineraries for the ultimate East
              African adventure
            </p>
          </div>
          <div className="flex gap-2 mt-6 md:mt-0">
            <button
              onClick={() => scroll("left")}
              className="w-12 h-12 rounded-full border-2 border-[hsl(357,52%,16%)] text-[hsl(357,52%,16%)] hover:bg-[hsl(357,52%,16%)] hover:text-white transition-colors flex items-center justify-center bg-transparent"
            >
              ←
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-12 h-12 rounded-full border-2 border-[hsl(357,52%,16%)] text-[hsl(357,52%,16%)] hover:bg-[hsl(357,52%,16%)] hover:text-white transition-colors flex items-center justify-center bg-transparent"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="flex-shrink-0 w-[340px] md:w-[360px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group snap-start overflow-hidden"
            >
              <div className="relative h-[220px] overflow-hidden">
                <img
                  src={tour.image}
                  alt={tour.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                {tour.featured && (
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white text-[hsl(357,52%,16%)] text-xs font-bold rounded-full uppercase tracking-wider">
                    Featured
                  </div>
                )}
                <div className="absolute bottom-4 left-4 flex gap-1.5">
                  {tour.countries.map((c) => (
                    <span
                      key={c}
                      className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs rounded-full"
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-lg font-bold text-[hsl(150,20%,10%)] mb-3 group-hover:text-[hsl(152,45%,25%)] transition-colors">
                  {tour.title}
                </h3>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    {tour.duration}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {tour.group_size}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-white text-white" />
                    {tour.rating}
                    <span className="text-gray-400">({tour.reviews_count})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {tour.highlights.map((h) => (
                    <span
                      key={h}
                      className="px-2.5 py-1 bg-[hsl(40,20%,96%)] text-[hsl(150,20%,30%)] text-xs rounded-full font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-xs text-gray-400">From</span>
                    <div className="text-xl font-bold text-[#401316]">
                      ${tour.price.toLocaleString()}
                    </div>
                    <span className="text-xs text-gray-400">per person</span>
                  </div>
                  <Link
                    href={`/tours/${tour.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#401316] text-white rounded-lg hover:bg-[#2d0e10] transition-colors text-sm font-medium"
                  >
                    View Details
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
