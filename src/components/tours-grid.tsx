"use client";

import { Tour } from "@/lib/types";
import Link from "next/link";
import { ArrowRight, Clock, Star, Users } from "lucide-react";
import { useState } from "react";

interface ToursGridProps {
  tours: Tour[];
}

export default function ToursGrid({ tours }: ToursGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Extract unique categories
  const categories: string[] = [
    "All",
    ...Array.from(new Set(tours.map((t) => t.category).filter((c): c is string => Boolean(c)))),
  ];

  // Filter tours based on selected category
  const filteredTours =
    selectedCategory === "All"
      ? tours
      : tours.filter((tour) => tour.category === selectedCategory);

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-[hsl(152,45%,25%)] text-white"
                : "bg-[hsl(40,20%,96%)] text-[hsl(150,20%,10%)] hover:bg-[hsl(152,45%,25%)] hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tours Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredTours.map((tour) => (
          <Link
            key={tour.id}
            href={`/tours/${tour.slug}`}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
          >
            {/* Image */}
            <div className="relative h-[240px] overflow-hidden">
              <img
                src={tour.image || ""}
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

            {/* Content */}
            <div className="p-6">
              <div className="text-xs font-medium text-[hsl(152,45%,25%)] uppercase tracking-wider mb-2">
                {tour.category}
              </div>
              <h3 className="text-xl font-bold text-[hsl(150,20%,10%)] mb-3 group-hover:text-[hsl(152,45%,25%)] transition-colors">
                {tour.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {tour.short_description}
              </p>

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
                </div>
              </div>

              {/* Highlights */}
              <div className="flex flex-wrap gap-1.5 mb-5">
                {tour.highlights.slice(0, 3).map((h) => (
                  <span
                    key={h}
                    className="px-2.5 py-1 bg-[hsl(40,20%,96%)] text-[hsl(150,20%,30%)] text-xs rounded-full font-medium"
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Price & CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-xs text-gray-400">From</span>
                  <div className="text-xl font-bold text-[#401316]">
                    ${tour.price.toLocaleString()}
                  </div>
                  <span className="text-xs text-gray-400">per person</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#401316] text-white rounded-lg text-sm font-medium group-hover:bg-[#2d0e10] transition-colors">
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTours.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">
            No tours found in this category. Try selecting a different category!
          </p>
        </div>
      )}
    </>
  );
}
