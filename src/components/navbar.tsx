'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import { LogIn, UserPlus, LayoutDashboard } from 'lucide-react'
import { useEffect, useState } from 'react'
import { createClient } from '../../supabase/client'
import UserProfile from './user-profile'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [logoUrl, setLogoUrl] = useState<string>('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createClient()
    
    // Get user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Get settings
    supabase.from("site_settings").select("*").single().then(({ data: settings }) => {
      if (settings?.logo_url) {
        setLogoUrl(settings.logo_url)
      }
    })
  }, [])

  return (
    <nav 
      className={`w-full fixed top-0 left-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white border-b border-gray-200 py-4 shadow-sm' 
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="flex items-center gap-3">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className={`h-16 w-auto object-contain transition-all duration-300 ${
                scrolled ? '' : 'brightness-0 invert'
              }`} 
            />
          ) : (
            <img 
              src="/rova%20africa%20png.png" 
              alt="RovAfrika Safari Tours" 
              className={`h-16 w-auto object-contain transition-all duration-300 ${
                scrolled ? '' : 'brightness-0 invert'
              }`} 
            />
          )}
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button 
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    scrolled 
                      ? '' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button 
                  variant="ghost" 
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    scrolled 
                      ? 'text-black hover:bg-gray-100' 
                      : 'text-white hover:bg-white/20'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button 
                  className={`flex items-center gap-2 transition-colors duration-300 ${
                    scrolled 
                      ? '' 
                      : 'bg-white text-black hover:bg-gray-100'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
