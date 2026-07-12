"use client";

import { Star, Hotel, Plane, Phone } from "lucide-react";
import Link from "next/link";

interface CTASectionProps {
  data?: {
    rating: number;
    total_guests: string;
    title: string;
    description: string;
    destination_image: string;
    background_image: string;
    destination_name: string;
    destination_description: string;
    destination_rating: string;
    destination_location: string;
    cta_text: string;
    button_text: string;
    button_link: string;
    phone_numbers: string[];
  };
}

export default function CTASection({ data }: CTASectionProps) {
  if (!data) return null;

  return (
    <section className="py-0 pb-32 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Image Card */}
          <div className="relative">
            {/* Background image card - offset to top left */}
            <div className="absolute top-4 left-4 w-full h-full rounded-3xl overflow-hidden opacity-60">
              <img
                src={data.background_image}
                alt="Background"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Main card */}
            <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden z-10">
              {/* Image */}
              <div className="relative h-[400px]">
                <img
                  src={data.destination_image}
                  alt={data.destination_name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                
                {/* Destination info overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white text-center">
                  <h3 className="text-2xl font-bold mb-2">{data.destination_name}</h3>
                  <p className="text-sm text-white/90 mb-4">{data.destination_description}</p>
                  
                  {/* Rating & Location */}
                  <div className="space-y-2 flex flex-col items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <Hotel className="w-4 h-4" />
                      <span>{data.destination_rating}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Plane className="w-4 h-4" />
                      <span>{data.destination_location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="space-y-6">
            {/* Rating badge */}
            <div className="inline-flex items-center gap-3 px-5 py-3">
              <div className="flex items-center gap-1">
                <span className="text-2xl font-bold text-[hsl(152,45%,25%)]">{data.rating}</span>
                <span className="text-yellow-500">★★★★★</span>
              </div>
              <span className="text-sm text-gray-600">• {data.total_guests}</span>
            </div>

            {/* Title */}
            <h2 className="text-4xl md:text-5xl font-bold text-[hsl(150,20%,10%)] leading-tight">
              {data.title}
            </h2>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed">
              {data.description}
            </p>

            {/* CTA text */}
            <p className="text-base text-gray-700 font-medium">
              {data.cta_text}
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-4 items-center pt-4 mb-8">
              <Link
                href={data.button_link}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-semibold shadow-md hover:shadow-lg"
              >
                {data.button_text}
              </Link>

              {/* Phone numbers */}
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center">
                  <Phone className="w-5 h-5 text-black" />
                </div>
                <div>
                  {data.phone_numbers
                    .filter((phone) => phone !== '+250787654321')
                    .map((phone, index) => (
                      <a
                        key={index}
                        href={`tel:${phone}`}
                        className="block text-black text-sm font-semibold hover:text-gray-600 transition-colors"
                      >
                        {phone}
                      </a>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
