import { createClient } from "../../../../supabase/server";
import { Tour } from "@/lib/types";
import ToursGrid from "@/components/tours-grid";

export default async function ToursPage() {
  const supabase = await createClient();
  const { data: tours } = await supabase
    .from("tours")
    .select("*")
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  const allTours = (tours as Tour[]) || [];

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80"
            alt="Safari landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <span className="inline-block text-white text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Our Tours
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Curated Safari
            <span className="block text-white">Experiences</span>
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            Explore our handcrafted itineraries across East Africa — from gorilla
            treks to Great Migration safaris
          </p>
        </div>
      </section>

      {/* Tours Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <ToursGrid tours={allTours} />
        </div>
      </section>
    </>
  );
}
