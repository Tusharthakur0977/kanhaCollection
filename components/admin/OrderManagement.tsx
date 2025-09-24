'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Package, Clock, CheckCircle, Truck, XCircle, Eye } from 'lucide-react'
import { createSupabaseClient } from "@/lib/supabaseClient";

import { Order } from '@/types'

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false })

    if (data) {
      setOrders(data)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId)

      if (error) throw error
      
      fetchOrders()
      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status } as Order)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert('Error updating order status')
    }
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

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Orders List */}
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-xl">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">Manage Orders</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <p className="text-gray-600">Total Orders: {filteredOrders.length}</p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {filteredOrders.map(order => (
              <div key={order.id} className="p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-800">
                        Order #{order.id.slice(0, 8)}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      {order.customer_name} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-orange-600 font-bold">
                      ₹{order.total_amount.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-xl p-6">
          {selectedOrder ? (
            <>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Order Information</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Order ID:</strong> {selectedOrder.id.slice(0, 8)}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Date:</strong> {new Date(selectedOrder.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Total:</strong> ₹{selectedOrder.total_amount.toLocaleString()}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Customer Information</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Name:</strong> {selectedOrder.customer_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Phone:</strong> {selectedOrder.customer_phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Address:</strong> {selectedOrder.customer_address}
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Order Status</h3>
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.order_items?.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                        <Image
                          src={item.product?.image || ''}
                          alt={item.product?.name || ''}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-800">
                            {item.product?.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ₹{item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}