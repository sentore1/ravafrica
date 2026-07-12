import SafariNavbar from "@/components/safari-navbar";
import SafariHero from "@/components/safari-hero";
import CountryNavigator from "@/components/country-navigator";
import FeaturedTours from "@/components/featured-tours";
import ExperienceCategories from "@/components/experience-categories";
import TrustIndicators from "@/components/trust-indicators";
import CTASection from "@/components/cta-section";
import InquiryForm from "@/components/inquiry-form";
import SafariFooter from "@/components/safari-footer";
import { createClient } from "../../supabase/server";

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();

  let heroContent = null;
  let heroStats = [];
  let heroImages = [];
  let tours = [];
  let testimonials = [];
  let trustStats = [];
  let partners = [];
  let settings = null;
  let destinations = [];
  let ctaSection = null;

  try {
    const results = await Promise.all([
      supabase.from("hero_content").select("*").eq("active", true).single(),
      supabase.from("hero_stats").select("*").eq("active", true).order("display_order"),
      supabase.from("hero_images").select("*").eq("active", true).order("display_order"),
      supabase.from("tours").select("*").eq("active", true).order("created_at", { ascending: false }),
      supabase.from("testimonials").select("*").eq("active", true).order("display_order"),
      supabase.from("trust_stats").select("*").eq("active", true).order("display_order"),
      supabase.from("partners").select("*").eq("active", true).order("display_order"),
      supabase.from("site_settings").select("*").single(),
      supabase.from("destinations").select("*").order("display_order"),
      supabase.from("cta_section").select("*").eq("active", true).single(),
    ]);

    heroContent = results[0].data;
    heroStats = results[1].data || [];
    heroImages = results[2].data || [];
    tours = results[3].data || [];
    testimonials = results[4].data || [];
    trustStats = results[5].data || [];
    partners = results[6].data || [];
    settings = results[7].data;
    destinations = results[8].data || [];
    ctaSection = results[9].data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }

  return (
    <div className="min-h-screen bg-white">
      <SafariNavbar settings={settings} />
      <SafariHero content={heroContent} stats={heroStats} images={heroImages} destinations={destinations} />
      <CountryNavigator />
      <FeaturedTours tours={tours} />
      <ExperienceCategories />
      <TrustIndicators 
        testimonials={testimonials} 
        stats={trustStats} 
        partners={partners} 
      />
      <CTASection data={ctaSection} />
      <InquiryForm stats={trustStats} />
      <SafariFooter />
    </div>
  );
}
