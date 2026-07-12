import Link from "next/link";
import { Binoculars, TreePine, Tent, Heart, Waves, Camera } from "lucide-react";
import { createClient } from "../../supabase/server";

const iconMap: Record<string, any> = {
  Binoculars,
  TreePine,
  Tent,
  Heart,
  Waves,
  Camera,
};

export default async function ExperienceCategories() {
  const supabase = await createClient();
  
  const { data: experiences } = await supabase
    .from("experience_categories")
    .select("*")
    .eq("active", true)
    .order("display_order");

  const categories = (experiences || []).map((exp: any) => {
    const IconComponent = iconMap[exp.icon] || TreePine;
    return {
      title: exp.title,
      description: exp.description,
      icon: <IconComponent className="w-7 h-7" />,
      image: exp.image,
      tours: exp.tours_count,
      id: exp.slug,
    };
  });
  return (
    <section className="py-20 md:py-28 bg-[#2C1810]" id="experiences">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-[hsla(0, 0%, 100%, 1.00)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
          
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-3xl font-bold text-white mb-4">
            Choose Your Adventure
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-l">
            From heart-pounding wildlife encounters to serene cultural
            experiences, find the perfect journey for you
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, index) => (
            <Link
              key={index}
              href="/tours"
              className="group relative rounded-2xl overflow-hidden h-[300px] cursor-pointer"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:from-[hsl(152,45%,20%)]/90 group-hover:via-[hsl(152,45%,20%)]/40 transition-all duration-500" />

              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-[hsl(20,73%,49%)]/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[hsl(20,73%,49%)] group-hover:text-white transition-all duration-300">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {cat.title}
                    </h3>
                    <span className="text-white/50 text-xs">
                      {cat.tours} tours available
                    </span>
                  </div>
                </div>
                <p className="text-white/70 text-sm leading-relaxed group-hover:text-white/90 transition-colors">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
