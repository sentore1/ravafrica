"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useState, useEffect } from "react";

interface HeroContent {
  badge_text: string;
  headline: string;
  headline_highlight: string;
  description: string;
  cta_primary_text: string;
  cta_primary_link: string;
  cta_secondary_text: string;
  background_image: string;
}

interface HeroStat {
  value: string;
  label: string;
}

interface HeroImage {
  image_url: string;
}

export default function SafariHero({ content, stats, images, destinations }: { content: HeroContent | null; stats: HeroStat[]; images: HeroImage[]; destinations?: any[] }) {
  const [showVideo, setShowVideo] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [mounted, setMounted] = useState(false);

  const defaultContent: HeroContent = {
    badge_text: "East Africa's Premier Safari Operator",
    headline: "Discover the",
    headline_highlight: "Heart of Africa",
    description: "Embark on unforgettable journeys across Rwanda, Uganda, Kenya,& Tanzania.",
    cta_primary_text: "Explore Our Tours",
    cta_primary_link: "/tours",
    cta_secondary_text: "Watch Our Story",
    background_image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80",
  };

  const hero = content || defaultContent;
  const destinationImages = destinations?.filter(d => d.image).map(d => ({ image_url: d.image })) || [];
  const heroImages = images.length > 0 ? images : (destinationImages.length > 0 ? destinationImages : [{ image_url: hero.background_image }]);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative min-h-[110vh] flex items-end overflow-hidden -mt-[100px] md:-mt-[104px]">
      <div className="absolute inset-0">
        {heroImages.map((img, idx) => (
          <img
            key={idx}
            src={img.image_url}
            alt="African savannah"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              idx === currentImage ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/35 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15" />
      </div>

      <div className="relative z-10 container mx-auto px-4 pb-16 md:pb-24 w-full">
        <div className="max-w-3xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight [text-shadow:_2px_2px_8px_rgb(0_0_0_/_60%),_0px_0px_20px_rgb(0_0_0_/_40%)]">
            {hero.headline}
            <span className="block text-white">
              {hero.headline_highlight}
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl leading-relaxed [text-shadow:_1px_1px_6px_rgb(0_0_0_/_50%),_0px_0px_15px_rgb(0_0_0_/_30%)]">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={hero.cta_primary_link}
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 bg-white text-black rounded-lg hover:bg-white/90 transition-all text-lg font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              {hero.cta_primary_text}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-3 py-1.5 text-white rounded-lg transition-all text-sm font-medium"
            >
              Learn More About Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-16 md:bottom-20 right-8 md:right-12 z-10 flex flex-col items-center gap-4">
        {mounted && heroImages.length > 1 && (
          <div className="flex gap-2">
            {heroImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentImage ? "bg-white w-8" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
