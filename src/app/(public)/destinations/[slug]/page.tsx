import { createClient } from "../../../../../supabase/server";
import { Destination, Tour } from "@/lib/types";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  Globe,
  Coins,
  Languages,
  Star,
  Users,
} from "lucide-react";

export default async function DestinationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: destination } = await supabase
    .from("destinations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!destination) {
    notFound();
  }

  const d = destination as Destination;

  // Fetch attractions for this destination
  const { data: attractionsData } = await supabase
    .from("destination_attractions")
    .select("name")
    .eq("destination_id", d.id)
    .order("display_order");

  const attractions = attractionsData?.map(a => a.name) || d.attractions || [];

  // Fetch tours for this destination
  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .contains("countries", [d.name])
    .eq("active", true);

  const destTours = (tours as Tour[]) || [];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[450px] flex items-end">
        <div className="absolute inset-0">
          <img
            src={d.image || ""}
            alt={d.name}
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
            Back to tours
          </Link>
          <div className="flex items-center gap-2 text-white mb-4">
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-semibold uppercase tracking-widest">
              East Africa
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-3">
            {d.name}
          </h1>
          <p className="text-2xl text-white/80 italic">{d.tagline}</p>
        </div>
      </section>

      {/* Info Bar */}
      <section className="bg-[hsl(357,52%,16%)] py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-white" />
              <div>
                <div className="text-xs text-white/60">Best Time to Visit</div>
                <div className="text-sm font-medium">{d.best_time}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-white" />
              <div>
                <div className="text-xs text-white/60">Currency</div>
                <div className="text-sm font-medium">{d.currency}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-white" />
              <div>
                <div className="text-xs text-white/60">Languages</div>
                <div className="text-sm font-medium">{d.language}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-white" />
              <div>
                <div className="text-xs text-white/60">Tours Available</div>
                <div className="text-sm font-medium">{destTours.length} tours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Description & Attractions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold text-[hsl(150,20%,10%)] mb-2">
                About {d.name}
              </h2>
              <p className="text-[hsl(152,45%,25%)] text-lg mb-6">{d.tagline}</p>
              <p className="text-gray-600 leading-relaxed text-lg">
                {d.description}
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold text-[hsl(150,20%,10%)] mb-4">
                Top Attractions
              </h3>
              <div className="space-y-3">
                {attractions.map((a) => (
                  <div
                    key={a}
                    className="flex items-center gap-3 p-3 bg-[hsl(40,20%,97%)] rounded-xl"
                  >
                    <MapPin className="w-4 h-4 text-[hsl(152,45%,25%)]" />
                    <span className="text-sm font-medium text-[hsl(150,20%,10%)]">
                      {a}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tours in this destination */}
      {destTours.length > 0 && (
        <section className="py-16 bg-[hsl(40,20%,97%)]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-[hsl(150,20%,10%)] mb-8">
              Tours in {d.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destTours.map((tour) => (
                <Link
                  key={tour.id}
                  href={`/tours/${tour.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all overflow-hidden"
                >
                  <div className="relative h-[200px] overflow-hidden">
                    <img
                      src={tour.image || ""}
                      alt={tour.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-[hsl(150,20%,10%)] mb-2 group-hover:text-[hsl(152,45%,25%)] transition-colors">
                      {tour.title}
                    </h3>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {tour.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-white text-white" />
                        {tour.rating}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-[hsl(152,45%,25%)]">
                        ${tour.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-[#401316] font-medium flex items-center gap-1">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
