"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  LogIn,
  User,
} from "lucide-react";

interface SafariNavbarProps {
  settings?: any;
}

const destinations = [
  { name: "Rwanda", href: "/destinations/rwanda" },
  { name: "Uganda", href: "/destinations/uganda" },
  { name: "Kenya", href: "/destinations/kenya" },
  { name: "Tanzania", href: "/destinations/tanzania" },
];

const experiences = [
  { name: "Gorilla Trekking", href: "/tours" },
  { name: "Big Five Safaris", href: "/tours" },
  { name: "Primate Tracking", href: "/tours" },
  { name: "Cultural Immersion", href: "/tours" },
  { name: "Beach Extensions", href: "/tours" },
];

export default function SafariNavbar({ settings }: SafariNavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // Check if we're on the homepage
  const isHomePage = pathname === '/';

  useEffect(() => {
    setMounted(true);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if navbar should have solid background
  const shouldBeSolid = !mounted || !isHomePage || scrolled;

  return (
    <>
      {/* Main Navbar */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        shouldBeSolid
          ? 'bg-white/95 backdrop-blur-md shadow-sm' 
          : 'bg-transparent'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20 md:h-24">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <img 
                src="/rova%20africa%20png.png" 
                alt="RovAfrika Safari Tours" 
                className={`h-20 md:h-24 w-auto object-contain transition-all duration-300 ${
                  shouldBeSolid ? '' : 'brightness-0 invert'
                }`} 
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1 ml-auto mr-4">
              <Link
                href="/"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  shouldBeSolid
                    ? 'text-[hsl(30,8%,13%)] hover:text-[hsl(357,52%,16%)]' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Home
              </Link>

              {/* Destinations Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setDestOpen(true)}
                onMouseLeave={() => setDestOpen(false)}
              >
                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                  shouldBeSolid
                    ? 'text-[hsl(30,8%,13%)] hover:text-[hsl(357,52%,16%)]' 
                    : 'text-white hover:text-white/80'
                }`}>
                  Destinations
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className={`absolute top-full left-0 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[180px] transition-opacity ${destOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {destinations.map((d) => (
                    <Link
                      key={d.name}
                      href={d.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[hsl(20,20%,96%)] hover:text-[hsl(357,52%,16%)] transition-colors"
                    >
                      {d.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Experiences Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setExpOpen(true)}
                onMouseLeave={() => setExpOpen(false)}
              >
                <button className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors ${
                  shouldBeSolid
                    ? 'text-[hsl(30,8%,13%)] hover:text-[hsl(357,52%,16%)]' 
                    : 'text-white hover:text-white/80'
                }`}>
                  Experiences
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <div className={`absolute top-full left-0 bg-white rounded-lg shadow-xl border border-gray-100 py-2 min-w-[200px] transition-opacity ${expOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                  {experiences.map((e) => (
                    <Link
                      key={e.name}
                      href={e.href}
                      className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-[hsl(20,20%,96%)] hover:text-[hsl(357,52%,16%)] transition-colors"
                    >
                      {e.name}
                    </Link>
                  ))}
                </div>
              </div>

              <Link
                href="/tours"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  shouldBeSolid
                    ? 'text-[hsl(30,8%,13%)] hover:text-[hsl(357,52%,16%)]' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Tours
              </Link>

              <Link
                href="/about"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  shouldBeSolid
                    ? 'text-[hsl(30,8%,13%)] hover:text-[hsl(357,52%,16%)]' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                About Us
              </Link>

              <Link
                href="/contact"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  shouldBeSolid
                    ? 'text-[hsl(30,8%,13%)] hover:text-[hsl(357,52%,16%)]' 
                    : 'text-white hover:text-white/80'
                }`}
              >
                Contact
              </Link>
            </div>

            {/* CTA + Contact Icon + Login + Mobile Toggle */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setContactModalOpen(true)}
                  className={`p-2 rounded-xl transition-colors ${
                    shouldBeSolid
                      ? 'text-[hsl(357,52%,16%)] hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                  aria-label="Contact Us"
                >
                  <Phone className="w-4 h-4" />
                </button>

                {/* Contact Dropdown */}
                {contactModalOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setContactModalOpen(false)}></div>
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-2xl shadow-2xl w-96 p-6 z-50">
                      <button
                        onClick={() => setContactModalOpen(false)}
                        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                      
                      <h3 className="text-lg font-bold text-[hsl(357,52%,16%)] mb-4">Contact Us</h3>
                      
                      <div className="space-y-3">
                        <a
                          href={`tel:${settings?.phone || '+250785519481'}`}
                          className="flex items-center gap-3 p-3 bg-[hsl(40,20%,97%)] rounded-lg hover:bg-[hsl(40,20%,94%)] transition-colors group"
                        >
                          <Phone className="w-5 h-5 text-[hsl(357,52%,16%)] flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Call Us</div>
                            <div className="font-semibold text-[hsl(357,52%,16%)] text-sm group-hover:text-[hsl(357,52%,20%)]">
                              {settings?.phone || '+250-785-519-481'}
                            </div>
                          </div>
                        </a>

                        <a
                          href={`mailto:${settings?.email || 'RovAfrika.safars@gmail.com'}`}
                          className="flex items-center gap-3 p-3 bg-[hsl(40,20%,97%)] rounded-lg hover:bg-[hsl(40,20%,94%)] transition-colors group"
                        >
                          <Mail className="w-5 h-5 text-[hsl(357,52%,16%)] flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Email Us</div>
                            <div className="font-semibold text-[hsl(357,52%,16%)] text-sm group-hover:text-[hsl(357,52%,20%)] break-all">
                              {settings?.email || 'RovAfrika.safars@gmail.com'}
                            </div>
                          </div>
                        </a>

                        <div className="flex items-center gap-3 p-3 bg-[hsl(40,20%,97%)] rounded-lg">
                          <MapPin className="w-5 h-5 text-[hsl(357,52%,16%)] flex-shrink-0" />
                          <div>
                            <div className="text-xs text-gray-500 mb-0.5">Visit Us</div>
                            <div className="font-semibold text-[hsl(357,52%,16%)] text-sm">
                              {settings?.address || 'KG 548 St, Kigali, Rwanda'}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Link
                          href="/contact"
                          onClick={() => setContactModalOpen(false)}
                          className="block w-full text-center px-4 py-2.5 bg-[hsl(357,52%,16%)] text-white rounded-lg hover:bg-[hsl(357,52%,20%)] transition-colors font-semibold text-sm"
                        >
                          Send Us a Message
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>
              
              {/* Login Icon */}
              <Link
                href="/sign-in"
                className={`hidden md:flex p-2 rounded-xl transition-colors ${
                  shouldBeSolid
                    ? 'text-[hsl(357,52%,16%)] hover:bg-gray-100' 
                    : 'text-white hover:bg-white/20'
                }`}
                aria-label="Sign In"
                title="Sign In"
              >
                <User className="w-4 h-4" />
              </Link>
              
              <Link
                href="/contact"
                className={`hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all text-sm font-semibold shadow-sm ${
                  shouldBeSolid
                    ? 'bg-[#401316] text-white hover:bg-[#2d0d0f]' 
                    : 'bg-white text-[#401316] hover:bg-gray-100'
                }`}
              >
                Plan Your Safari
              </Link>
              
              <button
                className={`lg:hidden p-2 transition-colors ${
                  shouldBeSolid ? 'text-[hsl(30,8%,13%)]' : 'text-white'
                }`}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="container mx-auto px-4 py-4 space-y-1">
              <Link
                href="/"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[hsl(20,20%,96%)] rounded-lg"
              >
                Home
              </Link>
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Destinations
              </div>
              {destinations.map((d) => (
                <Link
                  key={d.name}
                  href={d.href}
                  className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-[hsl(20,20%,96%)] rounded-lg"
                >
                  {d.name}
                </Link>
              ))}
              <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Experiences
              </div>
              {experiences.map((e) => (
                <Link
                  key={e.name}
                  href={e.href}
                  className="block px-6 py-2.5 text-sm text-gray-600 hover:bg-[hsl(20,20%,96%)] rounded-lg"
                >
                  {e.name}
                </Link>
              ))}
              <Link
                href="/tours"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[hsl(20,20%,96%)] rounded-lg"
              >
                Tours
              </Link>
              <Link
                href="/about"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[hsl(20,20%,96%)] rounded-lg"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block px-4 py-3 text-sm font-medium text-gray-700 hover:bg-[hsl(20,20%,96%)] rounded-lg"
              >
                Contact
              </Link>
              <div className="pt-2 space-y-2">
                <Link
                  href="/sign-in"
                  className="flex items-center justify-center gap-2 w-full px-5 py-3 border-2 border-[hsl(357,52%,16%)] text-[hsl(357,52%,16%)] rounded-lg hover:bg-[hsl(357,52%,16%)] hover:text-white transition-colors text-sm font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/contact"
                  className="block w-full text-center px-5 py-3 bg-[#401316] text-white rounded-lg hover:bg-[#2d0d0f] transition-colors text-sm font-semibold"
                >
                  Plan Your Safari
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
