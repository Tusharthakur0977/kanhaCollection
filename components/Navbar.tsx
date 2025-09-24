'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingCart, Heart, User, Home, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from "@/lib/supabaseClient";

import { useEffect } from 'react'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const pathname = usePathname()
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const supabase = createSupabaseClient()

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    if (user) {
      fetchCounts()
    }
  }, [user])

  const fetchCounts = async () => {
    if (!user) return

    const [cartResult, wishlistResult] = await Promise.all([
      supabase
        .from('cart_items')
        .select('quantity')
        .eq('user_id', user.id),
      supabase
        .from('wishlist_items')
        .select('id')
        .eq('user_id', user.id)
    ])

    if (cartResult.data) {
      const total = cartResult.data.reduce((sum, item) => sum + item.quantity, 0)
      setCartCount(total)
    }

    if (wishlistResult.data) {
      setWishlistCount(wishlistResult.data.length)
    }
  }

  return (
    <nav className="bg-gradient-to-r from-orange-500 to-yellow-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-orange-500" fill="currentColor" />
            </div>
            <span className="text-white font-bold text-xl">Kanha Collection</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                isActive('/') ? 'bg-white text-orange-600' : 'text-white hover:bg-orange-400'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <Link 
              href="/products" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/products') ? 'bg-white text-orange-600' : 'text-white hover:bg-orange-400'
              }`}
            >
              Products
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-2 rounded-md transition-colors ${
                isActive('/about') ? 'bg-white text-orange-600' : 'text-white hover:bg-orange-400'
              }`}
            >
              About
            </Link>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link 
                  href="/wishlist" 
                  className="relative p-2 text-white hover:bg-orange-400 rounded-md transition-colors"
                >
                  <Heart className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {wishlistCount}
                    </span>
                  )}
                </Link>
                <Link 
                  href="/cart" 
                  className="relative p-2 text-white hover:bg-orange-400 rounded-md transition-colors"
                >
                  <ShoppingCart className="w-6 h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 text-white hover:bg-orange-400 rounded-md transition-colors">
                    <User className="w-6 h-6" />
                    <span className="text-sm">{profile?.full_name || 'User'}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      Profile
                    </Link>
                    <Link href="/orders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                      My Orders
                    </Link>
                    {profile?.is_admin && (
                      <Link href="/admin" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                        Admin Panel
                      </Link>
                    )}
                    <button 
                      onClick={signOut}
                      className="w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link 
                href="/auth" 
                className="bg-white text-orange-600 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors font-semibold"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-white hover:bg-orange-400 rounded-md transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-orange-400">
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md">
                Home
              </Link>
              <Link href="/products" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md">
                Products
              </Link>
              <Link href="/about" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md">
                About
              </Link>
              {user ? (
                <>
                  <Link href="/wishlist" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>Wishlist ({wishlistCount})</span>
                  </Link>
                  <Link href="/cart" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md flex items-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Cart ({cartCount})</span>
                  </Link>
                  <Link href="/profile" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md">
                    Profile
                  </Link>
                  <Link href="/orders" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md">
                    My Orders
                  </Link>
                  {profile?.is_admin && (
                    <Link href="/admin" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md">
                      Admin Panel
                    </Link>
                  )}
                  <button 
                    onClick={signOut}
                    className="text-white hover:bg-orange-400 px-3 py-2 rounded-md text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth" className="text-white hover:bg-orange-400 px-3 py-2 rounded-md">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}