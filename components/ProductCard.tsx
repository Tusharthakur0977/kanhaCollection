'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [isInWishlist, setIsInWishlist] = useState(false)
  const supabase = createSupabaseClient()

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    setIsAddingToCart(true)
    try {
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
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
            user_id: user.id,
            product_id: product.id,
            quantity: 1
          })
      }

      // Refresh the page to update cart count
      window.location.reload()
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      router.push('/auth')
      return
    }

    setIsAddingToWishlist(true)
    try {
      const { data: existingItem } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', product.id)
        .single()

      if (existingItem) {
        await supabase
          .from('wishlist_items')
          .delete()
          .eq('id', existingItem.id)
        setIsInWishlist(false)
      } else {
        await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: product.id
          })
        setIsInWishlist(true)
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error)
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-500 overflow-hidden group transform hover:scale-105 hover:-translate-y-2">
      <div className="relative overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={handleToggleWishlist}
            disabled={isAddingToWishlist}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all duration-300 hover:scale-110"
          >
            <Heart 
              className={`w-4 h-4 ${isInWishlist ? 'text-red-500 fill-current' : 'text-red-500'}`} 
            />
          </button>
        </div>
        {product.featured && (
          <span className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold animate-pulse">
            Featured
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-orange-600">
            ₹{product.price.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            {product.quantity} in stock
          </span>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={product.quantity === 0 || isAddingToCart}
          className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
        >
          <ShoppingCart className="w-4 h-4" />
          <span>
            {isAddingToCart ? 'Adding...' : product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </div>
  )
}