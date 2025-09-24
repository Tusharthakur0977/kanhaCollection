'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Edit, Trash2, Save, X } from 'lucide-react'
import { createSupabaseClient } from '@/lib/supabase'
import { Product, Category } from '@/types'

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category_id: '',
    quantity: 0,
    featured: false
  })
  const supabase = createSupabaseClient()

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .order('created_at', { ascending: false })

    if (data) {
      setProducts(data)
    }
  }

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('name')

    if (data) {
      setCategories(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert(formData)

        if (error) throw error
      }
      
      resetForm()
      fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      image: '',
      category_id: '',
      quantity: 0,
      featured: false
    })
    setEditingProduct(null)
    setIsEditing(false)
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      category_id: product.category_id || '',
      quantity: product.quantity,
      featured: product.featured
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Product Form */}
      <div className="lg:col-span-1">
        <div className="bg-gray-50 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select Category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity in Stock
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="featured" className="ml-2 text-sm text-gray-700">
                Featured Product
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-orange-500 to-yellow-500 text-white py-2 px-4 rounded-lg hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <Save className="w-4 h-4" />
                <span>{editingProduct ? 'Update' : 'Add'} Product</span>
              </button>
              
              {editingProduct && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Products List */}
      <div className="lg:col-span-2">
        <div className="bg-gray-50 rounded-xl">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Manage Products</h2>
            <p className="text-gray-600">Total Products: {products.length}</p>
          </div>
          
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {products.map(product => (
              <div key={product.id} className="p-6 hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-800 flex items-center space-x-2">
                          <span>{product.name}</span>
                          {product.featured && (
                            <span className="bg-orange-100 text-orange-600 px-2 py-1 text-xs rounded-full">
                              Featured
                            </span>
                          )}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="text-orange-600 font-bold">₹{product.price.toLocaleString()}</span>
                          <span className="text-sm text-gray-500">Stock: {product.quantity}</span>
                          <span className="text-sm text-gray-500">{product.category?.name}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}