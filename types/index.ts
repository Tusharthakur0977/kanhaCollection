export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category_id: string | null
  quantity: number
  featured: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  customer_name: string
  customer_phone: string
  customer_address: string
  notes: string | null
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  created_at: string
  product?: Product
}

export interface Profile {
  id: string
  email: string
  full_name: string | null
  phone: string | null
  address: string | null
  is_admin: boolean
  created_at: string
  updated_at: string
}