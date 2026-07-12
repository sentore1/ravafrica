"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import {
  Calendar,
  Users,
  User,
  Mail,
  Phone,
  Send,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface BookingFormProps {
  tourId: string;
  tourTitle: string;
  tourPrice: number;
  tourDuration: string;
}

export default function BookingForm({
  tourId,
  tourTitle,
  tourPrice,
  tourDuration,
}: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [travelers, setTravelers] = useState(1);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    travel_date: "",
    special_requests: "",
  });

  const totalPrice = tourPrice * travelers;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from("bookings").insert({
        tour_id: tourId,
        tour_title: tourTitle,
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        travelers: travelers,
        travel_date: formData.travel_date || null,
        special_requests: formData.special_requests || null,
        total_price: totalPrice,
        status: "pending",
      });

      if (dbError) throw dbError;
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-[#D86222]/10 flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#D86222]" />
        </div>
        <h3 className="text-xl font-bold text-[hsl(150,20%,10%)] mb-2">
          Booking Submitted!
        </h3>
        <p className="text-gray-600 text-sm mb-4">
          Thank you, {formData.full_name}! We&apos;ve received your booking request
          for <strong>{tourTitle}</strong>. Our team will contact you within 24
          hours to confirm your safari.
        </p>
        <p className="text-xs text-gray-400">
          Confirmation will be sent to {formData.email}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Price Header */}
      <div className="bg-[#D86222] p-6 text-white">
        <div className="text-sm text-white/70 mb-1">Starting from</div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">
            ${tourPrice.toLocaleString()}
          </span>
          <span className="text-white/70 text-sm">/ person</span>
        </div>
        <div className="text-white/60 text-xs mt-1">{tourDuration}</div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) =>
                setFormData({ ...formData, full_name: e.target.value })
              }
              placeholder="Your full name"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D86222]/20 focus:border-[#D86222]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D86222]/20 focus:border-[#D86222]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Phone
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
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D86222]/20 focus:border-[#D86222]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Number of Travelers
          </label>
          <div className="relative">
            <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={travelers}
              onChange={(e) => setTravelers(parseInt(e.target.value))}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D86222]/20 focus:border-[#D86222] appearance-none bg-white"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Traveler" : "Travelers"}
                </option>
              ))}
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
              value={formData.travel_date}
              onChange={(e) =>
                setFormData({ ...formData, travel_date: e.target.value })
              }
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D86222]/20 focus:border-[#D86222]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Special Requests
          </label>
          <textarea
            rows={3}
            value={formData.special_requests}
            onChange={(e) =>
              setFormData({ ...formData, special_requests: e.target.value })
            }
            placeholder="Any special requirements..."
            className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D86222]/20 focus:border-[#D86222] resize-none"
          />
        </div>

        {/* Total */}
        <div className="bg-[hsl(40,20%,97%)] rounded-lg p-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>
              ${tourPrice.toLocaleString()} × {travelers}{" "}
              {travelers === 1 ? "person" : "people"}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="font-semibold text-[hsl(150,20%,10%)]">
              Estimated Total
            </span>
            <span className="text-2xl font-bold text-[#D86222]">
              ${totalPrice.toLocaleString()}
            </span>
          </div>
        </div>

        {error && (
          <div className="text-red-500 text-sm bg-red-50 rounded-lg p-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#D86222] text-white rounded-lg hover:bg-[#C2551E] transition-colors font-semibold text-base shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Book This Tour
            </>
          )}
        </button>

        <p className="text-center text-xs text-gray-400">
          No payment required now • Free cancellation within 48 hours
        </p>
      </form>
    </div>
  );
}
