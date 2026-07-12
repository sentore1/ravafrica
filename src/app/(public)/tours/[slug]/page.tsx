import { createClient } from "../../../../../supabase/server";
import { Tour } from "@/lib/types";
import { notFound } from "next/navigation";
import BookingForm from "@/components/booking-form";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Users,
  Star,
  MapPin,
  Check,
  X,
  Calendar,
} from "lucide-react";

export default async function TourDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: tour } = await supabase
    .from("tours")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (!tour) {
    notFound();
  }

  const t = tour as Tour;
  const itinerary = (t.itinerary || []) as {
    day: number;
    title: string;
    description: string;
  }[];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={t.image || ""}
            alt={t.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        </div>
        <div className="relative z-10 container mx-auto px-4 pb-12">
          <Link
            href="/tours"
            className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all tours
          </Link>
          {t.featured && (
            <div className="inline-block px-3 py-1 bg-white text-[hsl(357,52%,16%)] text-xs font-bold rounded-full uppercase tracking-wider mb-4 ml-4">
              Featured
            </div>
          )}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mb-6">
            {t.short_description}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-white/90">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-white" />
              {t.duration}
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-white" />
              {t.group_size} travelers
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 fill-white text-white" />
              {t.rating} ({t.reviews_count} reviews)
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              {t.countries.join(", ")}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-[hsl(150,20%,10%)] mb-4">
                  About This Tour
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {t.description}
                </p>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-2xl font-bold text-[hsl(150,20%,10%)] mb-6">
                  Tour Highlights
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {t.highlights.map((h) => (
                    <div
                      key={h}
                      className="flex items-center gap-3 p-4 bg-[hsl(40,20%,97%)] rounded-xl"
                    >
                      <div className="w-8 h-8 rounded-full bg-[hsl(152,45%,25%)]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-[hsl(152,45%,25%)]" />
                      </div>
                      <span className="text-sm font-medium text-[hsl(150,20%,10%)]">
                        {h}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itinerary */}
              {itinerary.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-[hsl(150,20%,10%)] mb-6">
                    Day-by-Day Itinerary
                  </h2>
                  <div className="space-y-4">
                    {itinerary.map((item, i) => (
                      <div
                        key={i}
                        className="flex gap-4 p-5 bg-[hsl(40,20%,97%)] rounded-xl"
                      >
                        <div className="w-12 h-12 rounded-xl bg-[hsl(152,45%,25%)] flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            D{item.day}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-[hsl(150,20%,10%)] mb-1">
                            {item.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Includes / Excludes */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-[hsl(150,20%,10%)] mb-4">
                    What&apos;s Included
                  </h3>
                  <ul className="space-y-3">
                    {t.includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[hsl(152,45%,25%)] mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[hsl(150,20%,10%)] mb-4">
                    What&apos;s Not Included
                  </h3>
                  <ul className="space-y-3">
                    {t.excludes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <X className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Right Column - Booking Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <BookingForm
                  tourId={t.id}
                  tourTitle={t.title}
                  tourPrice={t.price}
                  tourDuration={t.duration || ""}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
