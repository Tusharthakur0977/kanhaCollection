'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Package, Clock, CheckCircle, Truck, XCircle } from 'lucide-react'
import { useAuth } from '@/app/providers'
import { createSupabaseClient } from '@/lib/supabase'
import { Order } from '@/types'

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createSupabaseClient()

  useEffect(() => {
    if (!user) {
      router.push('/auth')
      return
    }
    fetchOrders()
  }, [user])

  const fetchOrders = async () => {
    if (!user) return

    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data)
    }
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="w-5 h-5 text-blue-500" />
      case 'processing':
        return <Package className="w-5 h-5 text-purple-500" />
      case 'shipped':
        return <Truck className="w-5 h-5 text-green-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'processing':
        return 'bg-purple-100 text-purple-800'
      case 'shipped':
        return 'bg-green-100 text-green-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              No orders yet
            </h2>
            <p className="text-gray-500 mb-8">
              Start shopping to see your orders here
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Order #{order.id.slice(0, 8)}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Placed on {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="capitalize">{order.status}</span>
                    </span>
                    <span className="text-lg font-bold text-orange-600">
                      ₹{order.total_amount.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p><strong>Customer:</strong> {order.customer_name}</p>
                    <p><strong>Phone:</strong> {order.customer_phone}</p>
                  </div>
                  <div>
                    <p><strong>Address:</strong> {order.customer_address}</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Order Items</h4>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4">
                      <Image
                        src={item.product?.image || ''}
                        alt={item.product?.name || ''}
                        width={60}
                        height={60}
                        className="w-15 h-15 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-800">{item.product?.name}</h5>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">
                          ₹{(item.price * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-gray-600 text-sm">
                          ₹{item.price.toLocaleString()} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}