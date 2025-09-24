'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from "@/lib/supabaseClient";

import { WishlistItem } from '@/types'

export default function WishlistPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    fetchWishlistItems()
  }, [user])

  const fetchWishlistItems = async () => {
    if (!user) return

    const { data } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', user.id)

    if (data) {
      setWishlistItems(data)
    }
    setLoading(false)
  }

  const removeFromWishlist = async (id: string) => {
    await supabase.from('wishlist_items').delete().eq('id', id)
    fetchWishlistItems()
  }

  const addToCart = async (productId: string) => {
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user!.id)
      .eq('product_id', productId)
      .single()

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + 1,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
    } else {
      await supabase
        .from('cart_items')
        .insert({
          user_id: user!.id,
          product_id: productId,
          quantity: 1
        })
    }

    // Optionally remove from wishlist after adding to cart
    // const wishlistItem = wishlistItems.find(item => item.product_id === productId)
    // if (wishlistItem) {
    //   await removeFromWishlist(wishlistItem.id)
    // }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading wishlist...</p>
          </div>
        </div>
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <Heart className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Save items you love for later
            </p>
            <a
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-semibold"
            >
              Browse Products
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={item.product?.image || ''}
                  alt={item.product?.name || ''}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
                  {item.product?.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {item.product?.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-orange-600">
                    ₹{item.product?.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-500">
                    {item.product?.quantity} in stock
                  </span>
                </div>
                
                <button
                  onClick={() => addToCart(item.product_id)}
                  disabled={item.product?.quantity === 0}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{item.product?.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}