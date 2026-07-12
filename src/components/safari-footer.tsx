"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "../../supabase/client";

const destinations = [
  { name: "Rwanda", href: "/destinations/rwanda" },
  { name: "Uganda", href: "/destinations/uganda" },
  { name: "Kenya", href: "/destinations/kenya" },
  { name: "Tanzania", href: "/destinations/tanzania" },
  { name: "Burundi", href: "/destinations/burundi" },
];

const experiences = [
  { name: "Gorilla Trekking", href: "/tours" },
  { name: "Big Five Safaris", href: "/tours" },
  { name: "Primate Tracking", href: "/tours" },
  { name: "Cultural Immersion", href: "/tours" },
  { name: "Beach Extensions", href: "/tours" },
];

const quickLinks = [
  { name: "About Us", href: "/about" },
  { name: "Our Tours", href: "/tours" },
  { name: "Testimonials", href: "/#testimonials" },
  { name: "Contact Us", href: "/contact" },
];

interface SafariFooterProps {
  settings?: any;
}

export default function SafariFooter({ settings: propSettings }: SafariFooterProps) {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<any>(propSettings);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!propSettings) {
      const fetchSettings = async () => {
        const supabase = createClient();
        const { data } = await supabase.from("site_settings").select("*").single();
        setSettings(data);
      };
      fetchSettings();
    }
  }, [propSettings]);

  return (
    <footer className="bg-[#D86222] text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-20 relative">
        {/* Mobile: Toggle content, Desktop: Modal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
          {/* Company Info */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <img src="/Footer%20logo.png" alt="RovAfrika Safari Tours" className="h-20 w-auto object-contain" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {settings?.company_description || "East Africa's premier safari operator, crafting unforgettable wildlife and cultural experiences across Rwanda, Uganda, Kenya, Tanzania, and Burundi since 2009."}
            </p>
            <div className="space-y-3">
              <a
                href={`tel:${settings?.phone || '+250785519481'}`}
                className="flex items-center gap-3 text-white/60 hover:text-black transition-colors text-sm"
              >
                <Phone className="w-4 h-4" />
                {settings?.phone || '+250-785-519-481'}
              </a>
              <a
                href={`mailto:${settings?.email || 'RovAfrika.safars@gmail.com'}`}
                className="flex items-center gap-3 text-white/60 hover:text-black transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                {settings?.email || 'RovAfrika.safars@gmail.com'}
              </a>
              <div className="flex items-center gap-3 text-white/60 text-sm">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                {settings?.address || 'KG 548 St, Kigali, Rwanda'}
              </div>
            </div>
          </div>

          {/* Destinations */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Destinations
            </h3>
            <ul className="space-y-3">
              {destinations.map((d) => (
                <li key={d.name}>
                  <Link
                    href={d.href}
                    className="text-white/60 hover:text-black transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {d.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Experiences
            </h3>
            <ul className="space-y-3">
              {experiences.map((e) => (
                <li key={e.name}>
                  <Link
                    href={e.href}
                    className="text-white/60 hover:text-black transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {e.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-6 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-black transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-white/40 text-sm">
              © {currentYear} {settings?.company_name || 'RovAfrika Safari Tours'}. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              {settings?.facebook_url && (
                <a
                  href={settings.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-black hover:text-white transition-all"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings?.instagram_url && (
                <a
                  href={settings.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-black hover:text-white transition-all"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings?.twitter_url && (
                <a
                  href={settings.twitter_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-black hover:text-white transition-all"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {settings?.youtube_url && (
                <a
                  href={settings.youtube_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-black hover:text-white transition-all"
                >
                  <Youtube className="w-4 h-4" />
                </a>
              )}
            </div>
            <div className="flex gap-6 text-sm text-white/40">
              <a href="#" className="hover:text-black transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-black transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
