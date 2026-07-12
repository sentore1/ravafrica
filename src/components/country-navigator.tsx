import { MapPin, ArrowRight, Mountain, TreePine, Waves, Sun, Bird } from "lucide-react";
import { createClient } from "../../supabase/server";
import CountryCard from "./country-card";

const iconMap: Record<string, any> = {
  Mountain: Mountain,
  TreePine: TreePine,
  Sun: Sun,
  Bird: Bird,
  Waves: Waves,
};

export default async function CountryNavigator() {
  const supabase = await createClient();
  
  const { data: destinations } = await supabase
    .from("destinations")
    .select(`
      *,
      destination_attractions(name, display_order)
    `)
    .eq("active", true)
    .order("display_order");

  const countries = (destinations || []).map((dest: any) => {
    const IconComponent = iconMap[dest.icon] || Mountain;
    return {
      name: dest.name,
      tagline: dest.tagline,
      image: dest.image,
      attractions: (dest.destination_attractions || [])
        .sort((a: any, b: any) => a.display_order - b.display_order)
        .map((attr: any) => attr.name),
      icon: <IconComponent className="w-5 h-5" />,
      color: dest.color,
    };
  });


  return (
    <section className="py-20 md:py-28 bg-[hsl(40,20%,97%)]" id="destinations">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block text-[hsla(0, 0%, 0%, 1.00)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Destinations
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(150,20%,10%)] mb-4">
            Four Countries, One Epic Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontSize: '16px' }}>
            Explore the diverse landscapes and wildlife of East Africa across four
            extraordinary destinations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-4 items-start auto-rows-fr">
          {countries.slice(0, 4).map((country, index) => (
            <CountryCard key={country.name} country={country} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
