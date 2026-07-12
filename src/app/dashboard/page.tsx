import { redirect } from "next/navigation";
import { createClient } from "../../../supabase/server";
import AdminDashboard from "@/components/admin-dashboard";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Check if user is admin (case-insensitive)
  const { data: adminUser, error: adminError } = await supabase
    .from("admin_users")
    .select("email")
    .ilike("email", user.email || "")
    .single();

  // Debug logging
  console.log("=== ADMIN CHECK DEBUG ===");
  console.log("User email:", user.email);
  console.log("Admin user found:", adminUser);
  console.log("Admin error:", adminError);
  console.log("========================");

  if (!adminUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  // Fetch all dashboard data
  const [
    { data: bookings },
    { data: inquiries },
    { data: tours },
    { count: subscriberCount },
  ] = await Promise.all([
    supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    supabase.from("inquiries").select("*").order("created_at", { ascending: false }),
    supabase.from("tours").select("*").order("created_at", { ascending: false }),
    supabase.from("newsletter_subscribers").select("*", { count: "exact", head: true }),
  ]);

  return (
    <AdminDashboard
      user={user}
      bookings={bookings || []}
      inquiries={inquiries || []}
      tours={tours || []}
      subscriberCount={subscriberCount || 0}
    />
  );
}
