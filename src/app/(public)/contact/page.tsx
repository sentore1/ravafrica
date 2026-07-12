"use client";

import { useState } from "react";
import { createClient } from "../../../../supabase/client";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  Loader2,
  MessageSquare,
  Globe,
  User,
  Calendar,
  Users,
} from "lucide-react";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    destination: "",
    travelers: "",
    travelDate: "",
    interests: [] as string[],
    message: "",
  });

  const interestOptions = [
    "Gorilla Trekking",
    "Big Five Safari",
    "Primate Tracking",
    "Cultural Immersion",
    "Beach Extension",
    "Luxury Camping",
    "Photography Tour",
    "Family Adventure",
  ];

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("inquiries").insert({
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone || null,
        destination: formData.destination || null,
        travelers: formData.travelers || null,
        travel_date: formData.travelDate || null,
        interests: formData.interests,
        message: formData.message || null,
        status: "new",
      });

      if (dbError) throw dbError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] min-h-[350px] flex items-center">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80"
            alt="African landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>
        <div className="relative z-10 container mx-auto px-4">
          <span className="inline-block text-[hsl(20,73%,49%)] text-sm font-semibold uppercase tracking-[0.2em] mb-3">
            Contact Us
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Get in Touch
          </h1>
          <p className="text-white/80 text-lg max-w-xl">
            Ready to plan your East African adventure? We&apos;d love to hear from
            you.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Info Column */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-[hsl(30,8%,13%)] mb-6">
                  Our Office
                </h2>
                <div className="p-5 bg-[hsl(20,20%,97%)] rounded-xl">
                  <div className="text-xs font-medium text-[hsl(357,52%,16%)] uppercase tracking-wider mb-2">
                    Headquarters
                  </div>
                  <div className="font-semibold text-[hsl(30,8%,13%)] mb-3">
                    Kigali, Rwanda
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <MapPin className="w-4 h-4" />
                    KG 548 St, Kigali, Rwanda
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <Phone className="w-4 h-4" />
                    +250-785-519-481
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    RovAfrika.safars@gmail.com
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-[hsl(20,20%,97%)] rounded-xl">
                  <Mail className="w-5 h-5 text-[hsl(357,52%,16%)]" />
                  <div>
                    <div className="text-sm font-medium text-[hsl(30,8%,13%)]">
                      Email
                    </div>
                    <div className="text-sm text-gray-500">
                      RovAfrika.safars@gmail.com
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[hsl(20,20%,97%)] rounded-xl">
                  <Clock className="w-5 h-5 text-[hsl(357,52%,16%)]" />
                  <div>
                    <div className="text-sm font-medium text-[hsl(30,8%,13%)]">
                      Working Hours
                    </div>
                    <div className="text-sm text-gray-500">
                      Mon-Fri: 8AM-6PM (EAT) | Sat: 9AM-3PM
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-[hsl(20,20%,97%)] rounded-xl">
                  <Globe className="w-5 h-5 text-[hsl(357,52%,16%)]" />
                  <div>
                    <div className="text-sm font-medium text-[hsl(30,8%,13%)]">
                      Response Time
                    </div>
                    <div className="text-sm text-gray-500">
                      Within 24 hours guaranteed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              {success ? (
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
                  <div className="w-16 h-16 rounded-full bg-[hsl(357,52%,16%)]/10 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[hsl(357,52%,16%)]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[hsl(30,8%,13%)] mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600">
                    Thank you for reaching out. Our team will get back to you
                    within 24 hours.
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
                  <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-[hsl(357,52%,16%)]" />
                    <h3 className="text-xl font-bold text-[hsl(30,8%,13%)]">
                      Send Us a Message
                    </h3>
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            value={formData.full_name}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                full_name: e.target.value,
                              })
                            }
                            placeholder="John Doe"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]/20 focus:border-[hsl(152,45%,25%)] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            placeholder="john@example.com"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]/20 focus:border-[hsl(152,45%,25%)] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Phone Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            placeholder="+1 234 567 8900"
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]/20 focus:border-[hsl(152,45%,25%)] transition-colors"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Preferred Destination
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={formData.destination}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                destination: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]/20 focus:border-[hsl(152,45%,25%)] transition-colors appearance-none bg-white"
                          >
                            <option value="">Select destination</option>
                            <option value="rwanda">Rwanda</option>
                            <option value="uganda">Uganda</option>
                            <option value="kenya">Kenya</option>
                            <option value="tanzania">Tanzania</option>
                            <option value="burundi">Burundi</option>
                            <option value="multi">Multi-Country</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Number of Travelers
                        </label>
                        <div className="relative">
                          <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <select
                            value={formData.travelers}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                travelers: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]/20 focus:border-[hsl(152,45%,25%)] transition-colors appearance-none bg-white"
                          >
                            <option value="">Select</option>
                            <option value="1">1 Traveler</option>
                            <option value="2">2 Travelers</option>
                            <option value="3-4">3-4 Travelers</option>
                            <option value="5-8">5-8 Travelers</option>
                            <option value="9+">9+ Travelers</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Preferred Travel Date
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="date"
                            value={formData.travelDate}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                travelDate: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(152,45%,25%)]/20 focus:border-[hsl(152,45%,25%)] transition-colors"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Interests (select all that apply)
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {interestOptions.map((interest) => (
                          <button
                            key={interest}
                            type="button"
                            onClick={() => handleInterestToggle(interest)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                              formData.interests.includes(interest)
                                ? "bg-[hsl(357,52%,16%)] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {interest}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Additional Details
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        placeholder="Tell us about your dream safari — any special requests, occasions, or must-see experiences..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(357,52%,16%)]/20 focus:border-[hsl(357,52%,16%)] transition-colors resize-none"
                      />
                    </div>

                    {error && (
                      <div className="text-red-500 text-sm bg-red-50 rounded-lg p-3">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[hsl(20,73%,49%)] text-white rounded-lg hover:bg-[hsl(20,73%,42%)] transition-colors font-semibold text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Request Your Custom Itinerary
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                      Free consultation • No obligation • Response within 24 hours
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
