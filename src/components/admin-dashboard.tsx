"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import Link from "next/link";
import { Booking, Inquiry, Tour } from "@/lib/types";
import {
  LayoutDashboard,
  CalendarCheck,
  MessageSquare,
  Map,
  Users,
  LogOut,
  TrendingUp,
  DollarSign,
  Eye,
  ChevronDown,
  Check,
  X,
  Clock,
  Mail,
  Phone,
  User as UserIcon,
  Loader2,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Save,
} from "lucide-react";

interface AdminDashboardProps {
  user: any;
  bookings: Booking[];
  inquiries: Inquiry[];
  tours: Tour[];
  subscriberCount: number;
}

type Tab = "overview" | "bookings" | "inquiries" | "tours" | "cms";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800",
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  converted: "bg-green-100 text-green-800",
  closed: "bg-gray-100 text-gray-800",
};

export default function AdminDashboard({
  user,
  bookings,
  inquiries,
  tours,
  subscriberCount,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [isAddingTour, setIsAddingTour] = useState(false);
  const [tourForm, setTourForm] = useState({
    title: "",
    price: 0,
    duration: "",
    countries: [] as string[],
    category: "",
    short_description: "",
    image: "",
  });
  const [settings, setSettings] = useState<any>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [heroImages, setHeroImages] = useState<any[]>([]);
  const [editingSettings, setEditingSettings] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File, type: string, id?: string) => {
    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `${type}-${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("images").upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
    
    if (type === "logo") {
      setSettings({ ...settings, logo_url: publicUrl });
    } else if (type === "destination" && id) {
      await handleUpdateDestination(id, "image", publicUrl);
    } else if (type === "experience" && id) {
      await handleUpdateExperience(id, "image", publicUrl);
    }
    setUploading(false);
  };

  const fetchCMSData = async () => {
    try {
      const supabase = createClient();
      
      // Log the current user for debugging
      const { data: { user } } = await supabase.auth.getUser();
      console.log("Fetching CMS data as user:", user?.email);
      
      const [settingsRes, destRes, expRes, heroRes] = await Promise.all([
        supabase.from("site_settings").select("*").maybeSingle(),
        supabase.from("destinations").select("*").order("display_order"),
        supabase.from("experience_categories").select("*").order("display_order"),
        supabase.from("hero_images").select("*").order("display_order"),
      ]);
      
      // Log any errors for debugging
      if (settingsRes.error) {
        console.error("Settings error:", settingsRes.error);
        console.error("Settings error details:", JSON.stringify(settingsRes.error, null, 2));
        console.error("Settings error code:", settingsRes.error.code);
        console.error("Settings error message:", settingsRes.error.message);
        console.error("Settings error hint:", settingsRes.error.hint);
        alert(`Failed to load settings: ${settingsRes.error.message || settingsRes.error.code || 'Unknown error'}`);
      }
      if (destRes.error) {
        console.error("Destinations error:", destRes.error);
        console.error("Destinations error details:", JSON.stringify(destRes.error, null, 2));
      }
      if (expRes.error) {
        console.error("Experiences error:", expRes.error);
        console.error("Experiences error details:", JSON.stringify(expRes.error, null, 2));
      }
      if (heroRes.error) {
        console.error("Hero images error:", heroRes.error);
        console.error("Hero images error details:", JSON.stringify(heroRes.error, null, 2));
      }
      
      console.log("Settings data:", settingsRes.data);
      console.log("Destinations count:", destRes.data?.length);
      console.log("Experiences count:", expRes.data?.length);
      console.log("Hero images count:", heroRes.data?.length);
      
      setSettings(settingsRes.data);
      setDestinations(destRes.data || []);
      setExperiences(expRes.data || []);
      setHeroImages(heroRes.data || []);
    } catch (error) {
      console.error("Error fetching CMS data:", error);
      alert("Failed to load CMS data. Check console for details.");
    }
  };

  const handleUpdateSettings = async () => {
    if (!settings || !settings.id) {
      alert("Settings not loaded. Please refresh and try again.");
      setEditingSettings(false);
      return;
    }
    setUpdatingId("settings");
    const supabase = createClient();
    await supabase.from("site_settings").update(settings).eq("id", settings.id);
    setUpdatingId(null);
    setEditingSettings(false);
  };

  const handleUpdateDestination = async (id: string, field: string, value: any) => {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("destinations").update({ [field]: value }).eq("id", id);
    await fetchCMSData();
    setUpdatingId(null);
  };

  const handleUpdateExperience = async (id: string, field: string, value: any) => {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("experience_categories").update({ [field]: value }).eq("id", id);
    await fetchCMSData();
    setUpdatingId(null);
  };

  const handleBulkUpdateExperience = async (id: string, updates: Record<string, any>) => {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("experience_categories").update(updates).eq("id", id);
    await fetchCMSData();
    setUpdatingId(null);
  };

  const handleBulkUpdateDestination = async (id: string, updates: Record<string, any>) => {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("destinations").update(updates).eq("id", id);
    await fetchCMSData();
    setUpdatingId(null);
  };

  const handleDeleteDestination = async (id: string) => {
    if (!confirm("Delete this destination?")) return;
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("destinations").delete().eq("id", id);
    await fetchCMSData();
    setUpdatingId(null);
  };

  const handleAddHeroImage = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const fileExt = file.name.split(".").pop();
    const fileName = `hero-${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage.from("images").upload(fileName, file);
    if (error) {
      alert("Upload failed: " + error.message);
      setUploading(false);
      return;
    }
    const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
    await supabase.from("hero_images").insert({ image_url: publicUrl, display_order: heroImages.length + 1, active: true });
    await fetchCMSData();
    setUploading(false);
    window.location.reload();
  };

  const handleDeleteHeroImage = async (id: string) => {
    if (!confirm("Delete this hero image?")) return;
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("hero_images").delete().eq("id", id);
    await fetchCMSData();
    setUpdatingId(null);
  };

  const handleToggleHeroImage = async (id: string, active: boolean) => {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("hero_images").update({ active: !active }).eq("id", id);
    await fetchCMSData();
    setUpdatingId(null);
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.total_price || 0), 0);

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const handleBookingStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);
    window.location.reload();
  };

  const handleInquiryStatus = async (id: string, status: string) => {
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("inquiries").update({ status }).eq("id", id);
    window.location.reload();
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/sign-in";
  };

  const handleSaveTour = async () => {
    setUpdatingId("saving");
    const supabase = createClient();
    const slug = tourForm.title.toLowerCase().replace(/\s+/g, "-");
    
    if (editingTour) {
      await supabase.from("tours").update({
        title: tourForm.title,
        price: tourForm.price,
        duration: tourForm.duration,
        countries: tourForm.countries,
        category: tourForm.category,
        short_description: tourForm.short_description,
        image: tourForm.image,
        updated_at: new Date().toISOString(),
      }).eq("id", editingTour.id);
    } else {
      await supabase.from("tours").insert({
        title: tourForm.title,
        slug,
        price: tourForm.price,
        duration: tourForm.duration,
        countries: tourForm.countries,
        category: tourForm.category,
        short_description: tourForm.short_description,
        description: tourForm.short_description,
        image: tourForm.image,
      });
    }
    
    setEditingTour(null);
    setIsAddingTour(false);
    window.location.reload();
  };

  const handleDeleteTour = async (id: string) => {
    if (!confirm("Delete this tour?")) return;
    setUpdatingId(id);
    const supabase = createClient();
    await supabase.from("tours").delete().eq("id", id);
    window.location.reload();
  };

  const startEditTour = (tour: Tour) => {
    setEditingTour(tour);
    setTourForm({
      title: tour.title,
      price: tour.price,
      duration: tour.duration || "",
      countries: tour.countries,
      category: tour.category || "",
      short_description: tour.short_description || "",
      image: tour.image || "",
    });
    setIsAddingTour(true);
  };

  const tabs: { id: Tab; label: string; icon: any; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "bookings",
      label: "Bookings",
      icon: CalendarCheck,
      badge: pendingBookings,
    },
    {
      id: "inquiries",
      label: "Inquiries",
      icon: MessageSquare,
      badge: newInquiries,
    },
    { id: "tours", label: "Tours", icon: Map },
    { id: "cms", label: "CMS", icon: RefreshCw },
  ];

  // Auto-load CMS data when CMS tab is active
  useEffect(() => {
    if (activeTab === "cms" && !settings && !destinations.length && !experiences.length) {
      fetchCMSData();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navbar */}
      <header className="bg-[hsl(152,45%,20%)] text-white shadow-lg">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[hsl(20,73%,49%)] flex items-center justify-center">
                <span className="text-[hsl(150,20%,10%)] font-bold text-sm">
                  M
                </span>
              </div>
              <span className="font-bold text-lg hidden sm:block">
                RovAfrika Safari Tours
              </span>
            </Link>
            <span className="text-white/40 mx-2 hidden sm:block">|</span>
            <span className="text-white/70 text-sm hidden sm:block">
              Admin Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm text-white/70 hover:text-white transition-colors flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <UserIcon className="w-4 h-4" />
              </div>
              <span className="text-sm hidden sm:block">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[hsl(152,45%,25%)] text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      activeTab === tab.id
                        ? "bg-white/20 text-white"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Total Bookings</span>
                  <CalendarCheck className="w-5 h-5 text-[hsl(152,45%,25%)]" />
                </div>
                <div className="text-3xl font-bold text-[hsl(150,20%,10%)]">
                  {bookings.length}
                </div>
                <div className="text-sm text-yellow-600 mt-1">
                  {pendingBookings} pending
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Revenue</span>
                  <DollarSign className="w-5 h-5 text-[hsl(20,73%,49%)]" />
                </div>
                <div className="text-3xl font-bold text-[hsl(150,20%,10%)]">
                  ${totalRevenue.toLocaleString()}
                </div>
                <div className="text-sm text-green-600 mt-1">
                  From confirmed bookings
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Inquiries</span>
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-3xl font-bold text-[hsl(150,20%,10%)]">
                  {inquiries.length}
                </div>
                <div className="text-sm text-blue-600 mt-1">
                  {newInquiries} new
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">Newsletter</span>
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-3xl font-bold text-[hsl(150,20%,10%)]">
                  {subscriberCount}
                </div>
                <div className="text-sm text-purple-600 mt-1">Subscribers</div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Recent Bookings */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-[hsl(150,20%,10%)]">
                    Recent Bookings
                  </h3>
                  <button
                    onClick={() => setActiveTab("bookings")}
                    className="text-sm text-[hsl(152,45%,25%)] hover:underline"
                  >
                    View all →
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {bookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm text-[hsl(150,20%,10%)]">
                          {b.full_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {b.tour_title} •{" "}
                          {new Date(b.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-sm">
                          ${(b.total_price || 0).toLocaleString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[b.status]}`}
                        >
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No bookings yet
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Inquiries */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-[hsl(150,20%,10%)]">
                    Recent Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab("inquiries")}
                    className="text-sm text-[hsl(152,45%,25%)] hover:underline"
                  >
                    View all →
                  </button>
                </div>
                <div className="divide-y divide-gray-50">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div
                      key={inq.id}
                      className="p-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-medium text-sm text-[hsl(150,20%,10%)]">
                          {inq.full_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {inq.email} •{" "}
                          {new Date(inq.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[inq.status]}`}
                      >
                        {inq.status}
                      </span>
                    </div>
                  ))}
                  {inquiries.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      No inquiries yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">
                All Bookings ({bookings.length})
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Customer
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Tour
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Travel Date
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Travelers
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Total
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4">
                        <div className="font-medium text-sm text-[hsl(150,20%,10%)]">
                          {b.full_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {b.email}
                        </div>
                        {b.phone && (
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {b.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-sm text-[hsl(150,20%,10%)]">
                          {b.tour_title}
                        </div>
                        <div className="text-xs text-gray-400">
                          {new Date(b.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {b.travel_date
                          ? new Date(b.travel_date).toLocaleDateString()
                          : "Flexible"}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {b.travelers}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[hsl(150,20%,10%)]">
                        ${(b.total_price || 0).toLocaleString()}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {updatingId === b.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                        ) : (
                          <div className="flex gap-1">
                            {b.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handleBookingStatus(b.id, "confirmed")
                                  }
                                  className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
                                  title="Confirm"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleBookingStatus(b.id, "cancelled")
                                  }
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                                  title="Cancel"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                            {b.status === "confirmed" && (
                              <button
                                onClick={() =>
                                  handleBookingStatus(b.id, "completed")
                                }
                                className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors"
                              >
                                Complete
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {bookings.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No bookings yet. They will appear here when customers book tours.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Inquiries Tab */}
        {activeTab === "inquiries" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">
                All Inquiries ({inquiries.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-5 hover:bg-gray-50/50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-[hsl(150,20%,10%)] mb-1">
                        {inq.full_name}
                      </div>
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {inq.email}
                        </span>
                        {inq.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {inq.phone}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />{" "}
                          {new Date(inq.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[inq.status]}`}
                      >
                        {inq.status}
                      </span>
                      {updatingId === inq.id ? (
                        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                      ) : (
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            handleInquiryStatus(inq.id, e.target.value)
                          }
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="converted">Converted</option>
                          <option value="closed">Closed</option>
                        </select>
                      )}
                    </div>
                  </div>
                  {/* Details */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 mb-2">
                    {inq.destination && (
                      <span>Destination: <strong>{inq.destination}</strong></span>
                    )}
                    {inq.travelers && (
                      <span>Travelers: <strong>{inq.travelers}</strong></span>
                    )}
                    {inq.travel_date && (
                      <span>Date: <strong>{inq.travel_date}</strong></span>
                    )}
                  </div>
                  {inq.interests.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {inq.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-0.5 bg-[hsl(40,20%,96%)] rounded-full text-xs text-gray-600"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  )}
                  {inq.message && (
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mt-2">
                      {inq.message}
                    </p>
                  )}
                </div>
              ))}
              {inquiries.length === 0 && (
                <div className="p-12 text-center text-gray-400">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No inquiries yet. They will appear here when users submit forms.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tours Tab */}
        {activeTab === "tours" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">
                All Tours ({tours.length})
              </h3>
              <button
                onClick={() => {
                  setIsAddingTour(true);
                  setEditingTour(null);
                  setTourForm({
                    title: "",
                    price: 0,
                    duration: "",
                    countries: [],
                    category: "",
                    short_description: "",
                    image: "",
                  });
                }}
                className="flex items-center gap-2 px-4 py-2 bg-[hsl(152,45%,25%)] text-white rounded-lg hover:bg-[hsl(152,45%,20%)] transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Tour
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Tour
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Countries
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Duration
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Price
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Rating
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tours.map((tour) => (
                    <tr key={tour.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={tour.image || ""}
                            alt={tour.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium text-sm text-[hsl(150,20%,10%)]">
                              {tour.title}
                            </div>
                            <div className="text-xs text-gray-400">
                              {tour.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1">
                          {tour.countries.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        {tour.duration}
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[hsl(150,20%,10%)]">
                        ${tour.price.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-600">
                        ⭐ {tour.rating} ({tour.reviews_count})
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            tour.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {tour.active ? "Active" : "Inactive"}
                        </span>
                        {tour.featured && (
                          <span className="ml-2 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEditTour(tour)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteTour(tour.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                            title="Delete"
                            disabled={updatingId === tour.id}
                          >
                            {updatingId === tour.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tour Form Modal */}
            {isAddingTour && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">
                      {editingTour ? "Edit Tour" : "Add New Tour"}
                    </h3>
                    <button
                      onClick={() => {
                        setIsAddingTour(false);
                        setEditingTour(null);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tour Title *
                      </label>
                      <input
                        type="text"
                        value={tourForm.title}
                        onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                        placeholder="e.g., Serengeti Wildlife Safari"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price (USD) *
                        </label>
                        <input
                          type="number"
                          value={tourForm.price}
                          onChange={(e) => setTourForm({ ...tourForm, price: Number(e.target.value) })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                          placeholder="e.g., 3999"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration *
                        </label>
                        <input
                          type="text"
                          value={tourForm.duration}
                          onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                          placeholder="e.g., 7 Days"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category
                      </label>
                      <input
                        type="text"
                        value={tourForm.category}
                        onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                        placeholder="e.g., Wildlife Safari"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Countries (comma-separated) *
                      </label>
                      <input
                        type="text"
                        value={tourForm.countries.join(", ")}
                        onChange={(e) => setTourForm({ 
                          ...tourForm, 
                          countries: e.target.value.split(",").map(c => c.trim()).filter(c => c) 
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                        placeholder="e.g., Kenya, Tanzania, Uganda"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image *
                      </label>
                      
                      {/* Upload Button */}
                      <div className="flex gap-2 mb-2">
                        <label className="flex-1">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setUploading(true);
                                const supabase = createClient();
                                const fileExt = file.name.split(".").pop();
                                const fileName = `tour-${Date.now()}.${fileExt}`;
                                const { data, error } = await supabase.storage
                                  .from("images")
                                  .upload(fileName, file);
                                
                                if (error) {
                                  alert("Upload failed: " + error.message);
                                  setUploading(false);
                                  return;
                                }
                                
                                const { data: { publicUrl } } = supabase.storage
                                  .from("images")
                                  .getPublicUrl(fileName);
                                
                                setTourForm({ ...tourForm, image: publicUrl });
                                setUploading(false);
                              }
                            }}
                            className="hidden"
                            id="tour-image-upload"
                          />
                          <div className="w-full px-4 py-2 bg-[hsl(152,45%,25%)] text-white rounded-lg hover:bg-[hsl(152,45%,20%)] transition-colors text-center cursor-pointer flex items-center justify-center gap-2">
                            {uploading ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4" />
                                Upload Image
                              </>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* OR Divider */}
                      <div className="flex items-center gap-3 my-3">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="text-sm text-gray-500">or enter URL</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                      </div>

                      {/* URL Input */}
                      <input
                        type="text"
                        value={tourForm.image}
                        onChange={(e) => setTourForm({ ...tourForm, image: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                        placeholder="https://example.com/image.jpg"
                        disabled={uploading}
                      />
                      
                      {/* Image Preview */}
                      {tourForm.image && (
                        <div className="mt-3 relative">
                          <img
                            src={tourForm.image}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setTourForm({ ...tourForm, image: "" })}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Remove image"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Short Description *
                      </label>
                      <textarea
                        value={tourForm.short_description}
                        onChange={(e) => setTourForm({ ...tourForm, short_description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)] min-h-[100px]"
                        placeholder="Brief description of the tour..."
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveTour}
                        disabled={updatingId === "saving" || !tourForm.title || !tourForm.image || tourForm.price <= 0}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[hsl(152,45%,25%)] text-white rounded-lg hover:bg-[hsl(152,45%,20%)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updatingId === "saving" ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            {editingTour ? "Update Tour" : "Create Tour"}
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setIsAddingTour(false);
                          setEditingTour(null);
                        }}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* CMS Tab */}
        {activeTab === "cms" && (
          <div className="space-y-6">
            {/* Hero Section */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">Hero Section Images</h3>
                <button onClick={fetchCMSData} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Add New Hero Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleAddHeroImage(e.target.files[0])}
                    className="w-full px-3 py-2 border rounded-lg"
                    disabled={uploading}
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended size: 1920x1080px</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {heroImages.map((img) => (
                    <div key={img.id} className="relative group border rounded-lg overflow-hidden">
                      <img src={img.image_url} alt="Hero" className="w-full h-48 object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleToggleHeroImage(img.id, img.active)}
                          disabled={updatingId === img.id}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium ${img.active ? "bg-yellow-500 text-white" : "bg-green-500 text-white"}`}
                        >
                          {updatingId === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : img.active ? "Hide" : "Show"}
                        </button>
                        <button
                          onClick={() => handleDeleteHeroImage(img.id)}
                          disabled={updatingId === img.id}
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                        >
                          {updatingId === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </button>
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${img.active ? "bg-green-500 text-white" : "bg-gray-500 text-white"}`}>
                          {img.active ? "Active" : "Hidden"}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-1 bg-black/70 text-white rounded text-xs font-medium">
                          Order: {img.display_order}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Site Settings */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">Site Settings</h3>
                <button
                  onClick={async () => {
                    if (editingSettings) {
                      await handleUpdateSettings();
                    } else {
                      setUpdatingId("settings-loading");
                      await fetchCMSData();
                      setUpdatingId(null);
                      if (settings) {
                        setEditingSettings(true);
                      } else {
                        alert("Failed to load settings. Please check the console or database.");
                      }
                    }
                  }}
                  disabled={updatingId === "settings" || updatingId === "settings-loading"}
                  className="flex items-center gap-2 px-4 py-2 bg-[hsl(152,45%,25%)] text-white rounded-lg hover:bg-[hsl(152,45%,20%)] disabled:opacity-50"
                >
                  {(updatingId === "settings" || updatingId === "settings-loading") ? <Loader2 className="w-4 h-4 animate-spin" /> : editingSettings ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                  {updatingId === "settings-loading" ? "Loading..." : editingSettings ? "Save" : "Edit"}
                </button>
              </div>
              {!settings && !editingSettings && (
                <div className="p-6 text-center text-gray-500">
                  <p className="mb-2">Click "Edit" to load and modify site settings</p>
                </div>
              )}
              {editingSettings && settings && (
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">Logo</label>
                      <div className="flex gap-2">
                        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "logo")} className="flex-1 px-3 py-2 border rounded-lg" disabled={uploading} />
                        {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />}
                      </div>
                    </div>
                    <input type="text" placeholder="Logo Letter" value={settings.logo_letter || ""} onChange={(e) => setSettings({...settings, logo_letter: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Company Name" value={settings.company_name || ""} onChange={(e) => setSettings({...settings, company_name: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Company Tagline" value={settings.company_tagline || ""} onChange={(e) => setSettings({...settings, company_tagline: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Phone" value={settings.phone || ""} onChange={(e) => setSettings({...settings, phone: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Email" value={settings.email || ""} onChange={(e) => setSettings({...settings, email: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Address" value={settings.address || ""} onChange={(e) => setSettings({...settings, address: e.target.value})} className="px-3 py-2 border rounded-lg col-span-2" />
                    <textarea placeholder="Description" value={settings.company_description || ""} onChange={(e) => setSettings({...settings, company_description: e.target.value})} className="px-3 py-2 border rounded-lg col-span-2" rows={3} />
                    <input type="text" placeholder="Facebook URL" value={settings.facebook_url || ""} onChange={(e) => setSettings({...settings, facebook_url: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Instagram URL" value={settings.instagram_url || ""} onChange={(e) => setSettings({...settings, instagram_url: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="Twitter URL" value={settings.twitter_url || ""} onChange={(e) => setSettings({...settings, twitter_url: e.target.value})} className="px-3 py-2 border rounded-lg" />
                    <input type="text" placeholder="YouTube URL" value={settings.youtube_url || ""} onChange={(e) => setSettings({...settings, youtube_url: e.target.value})} className="px-3 py-2 border rounded-lg" />
                  </div>
                  <button onClick={() => setEditingSettings(false)} className="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
                </div>
              )}
            </div>

            {/* Destinations */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">Destinations</h3>
                <button onClick={fetchCMSData} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {destinations.map((dest) => (
                  <div key={dest.id} className="p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <img src={dest.image || '/placeholder.jpg'} alt={dest.name || ''} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={dest.name || ''}
                          onChange={(e) => {
                            const updated = destinations.map(item => 
                              item.id === dest.id ? { ...item, name: e.target.value } : item
                            );
                            setDestinations(updated);
                          }}
                          placeholder="Destination name"
                          className="font-semibold text-[hsl(150,20%,10%)] w-full px-2 py-1 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                          disabled={updatingId === dest.id}
                        />
                        <input
                          type="text"
                          placeholder="Tagline"
                          value={dest.tagline || ''}
                          onChange={(e) => {
                            const updated = destinations.map(item => 
                              item.id === dest.id ? { ...item, tagline: e.target.value } : item
                            );
                            setDestinations(updated);
                          }}
                          className="text-sm text-gray-500 w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                          disabled={updatingId === dest.id}
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBulkUpdateDestination(dest.id, { 
                            name: dest.name, 
                            tagline: dest.tagline 
                          })}
                          disabled={updatingId === dest.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[hsl(152,45%,25%)] text-white rounded-lg hover:bg-[hsl(152,45%,20%)] disabled:opacity-50 text-sm"
                          title="Save"
                        >
                          {updatingId === dest.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Save className="w-3 h-3" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteDestination(dest.id)}
                          disabled={updatingId === dest.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 text-sm"
                          title="Delete"
                        >
                          {updatingId === dest.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <Trash2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "destination", dest.id)} 
                        className="flex-1 px-3 py-2 border rounded-lg text-sm" 
                        disabled={updatingId === dest.id || uploading} 
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">Order: {dest.display_order}</span>
                    </div>
                  </div>
                ))}
                {destinations.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    No destinations found. Add them in the database first.
                  </div>
                )}
              </div>
            </div>

            {/* Experiences */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">Experience Categories</h3>
                <button onClick={fetchCMSData} className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-100">
                  <RefreshCw className="w-4 h-4" /> Refresh
                </button>
              </div>
              <div className="divide-y divide-gray-50">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-5">
                    <div className="flex items-center gap-4 mb-3">
                      <img src={exp.image || '/placeholder.jpg'} alt={exp.name || ''} className="w-16 h-16 rounded-lg object-cover" />
                      <div className="flex-1">
                        <input
                          type="text"
                          value={exp.name || ''}
                          onChange={(e) => {
                            const updated = experiences.map(item => 
                              item.id === exp.id ? { ...item, name: e.target.value } : item
                            );
                            setExperiences(updated);
                          }}
                          placeholder="Category name"
                          className="font-semibold text-[hsl(150,20%,10%)] w-full px-2 py-1 border rounded mb-1 focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                        />
                        <textarea
                          value={exp.description || ''}
                          onChange={(e) => {
                            const updated = experiences.map(item => 
                              item.id === exp.id ? { ...item, description: e.target.value } : item
                            );
                            setExperiences(updated);
                          }}
                          placeholder="Description"
                          rows={2}
                          className="text-sm text-gray-500 w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleBulkUpdateExperience(exp.id, { 
                            name: exp.name, 
                            description: exp.description 
                          })}
                          disabled={updatingId === exp.id}
                          className="flex items-center gap-1 px-3 py-1.5 bg-[hsl(152,45%,25%)] text-white rounded-lg hover:bg-[hsl(152,45%,20%)] disabled:opacity-50 text-sm"
                        >
                          {updatingId === exp.id ? (
                            <>
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="w-3 h-3" />
                              Save
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], "experience", exp.id)} 
                        className="flex-1 px-3 py-2 border rounded-lg text-sm" 
                        disabled={updatingId === exp.id || uploading} 
                      />
                      <span className="text-xs text-gray-500 whitespace-nowrap">Order: {exp.display_order}</span>
                    </div>
                  </div>
                ))}
                {experiences.length === 0 && (
                  <div className="p-8 text-center text-gray-400">
                    No experience categories found. Add them in the database first.
                  </div>
                )}
              </div>
            </div>

            {/* Tours */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[hsl(150,20%,10%)]">
                  Manage Packages
                </h3>
                <button
                  onClick={() => {
                    setIsAddingTour(true);
                    setEditingTour(null);
                    setTourForm({ title: "", price: 0, duration: "", countries: [], category: "", short_description: "", image: "" });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-[hsl(152,45%,25%)] text-white rounded-lg hover:bg-[hsl(152,45%,20%)] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Package
                </button>
              </div>

              {isAddingTour && (
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h4 className="font-semibold mb-4">{editingTour ? "Edit" : "Add"} Package</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Package Title"
                      value={tourForm.title}
                      onChange={(e) => setTourForm({ ...tourForm, title: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="number"
                      placeholder="Price (USD)"
                      value={tourForm.price || ""}
                      onChange={(e) => setTourForm({ ...tourForm, price: parseInt(e.target.value) || 0 })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., 7 Days)"
                      value={tourForm.duration}
                      onChange={(e) => setTourForm({ ...tourForm, duration: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Category"
                      value={tourForm.category}
                      onChange={(e) => setTourForm({ ...tourForm, category: e.target.value })}
                      className="px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Countries (comma-separated)"
                      value={tourForm.countries.join(", ")}
                      onChange={(e) => setTourForm({ ...tourForm, countries: e.target.value.split(",").map(c => c.trim()) })}
                      className="px-3 py-2 border rounded-lg col-span-2"
                    />
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-2">Package Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            setUploading(true);
                            const supabase = createClient();
                            const file = e.target.files[0];
                            const fileExt = file.name.split(".").pop();
                            const fileName = `tour-${Date.now()}.${fileExt}`;
                            const { data } = await supabase.storage.from("images").upload(fileName, file);
                            if (data) {
                              const { data: { publicUrl } } = supabase.storage.from("images").getPublicUrl(fileName);
                              setTourForm({ ...tourForm, image: publicUrl });
                            }
                            setUploading(false);
                          }
                        }}
                        className="w-full px-3 py-2 border rounded-lg"
                        disabled={uploading}
                      />
                      {tourForm.image && <img src={tourForm.image} alt="Preview" className="mt-2 w-24 h-24 rounded-lg object-cover" />}
                    </div>
                    <textarea
                      placeholder="Short Description"
                      value={tourForm.short_description}
                      onChange={(e) => setTourForm({ ...tourForm, short_description: e.target.value })}
                      className="px-3 py-2 border rounded-lg col-span-2"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={handleSaveTour}
                      disabled={updatingId === "saving"}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {updatingId === "saving" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </button>
                    <button
                      onClick={() => { setIsAddingTour(false); setEditingTour(null); }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className="divide-y divide-gray-50">
                {tours.map((tour) => (
                  <div key={tour.id} className="p-5 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="font-semibold text-[hsl(150,20%,10%)]">{tour.title}</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {tour.duration} • {tour.countries.join(", ")} • ${tour.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditTour(tour)}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTour(tour.id)}
                        disabled={updatingId === tour.id}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg disabled:opacity-50"
                      >
                        {updatingId === tour.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
