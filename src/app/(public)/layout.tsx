import SafariNavbar from "@/components/safari-navbar";
import SafariFooter from "@/components/safari-footer";
import { createClient } from "../../../supabase/server";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: settings } = await supabase.from("site_settings").select("*").single();

  return (
    <div className="min-h-screen bg-white">
      <SafariNavbar settings={settings} />
      <main>{children}</main>
      <SafariFooter settings={settings} />
    </div>
  );
}
