"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, MessageCircle } from "lucide-react";
import { useAuth } from "@/app/providers";
import { createSupabaseClient } from "@/lib/supabaseClient";

import { CartItem } from "@/types";

export default function CartPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const supabase = createSupabaseClient();

  useEffect(() => {
    if (!user) {
      router.push("/auth");
      return;
    }
    fetchCartItems();
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;

    const { data } = await supabase
      .from("cart_items")
      .select(
        `
        *,
        product:products(*)
      `
      )
      .eq("user_id", user.id);

    if (data) {
      setCartItems(data);
    }
    setLoading(false);
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await supabase.from("cart_items").delete().eq("id", id);
    } else {
      await supabase
        .from("cart_items")
        .update({ quantity, updated_at: new Date().toISOString() })
        .eq("id", id);
    }
    fetchCartItems();
  };

  const removeItem = async (id: string) => {
    await supabase.from("cart_items").delete().eq("id", id);
    fetchCartItems();
  };

  const handleWhatsAppOrder = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      alert("Please fill in all customer information");
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity,
      0
    );

    // Create order in database
    const { data: order } = await supabase
      .from("orders")
      .insert({
        user_id: user!.id,
        total_amount: total,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: customerInfo.address,
        status: "pending",
      })
      .select()
      .single();

    if (order) {
      // Create order items
      const orderItems = cartItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0,
      }));

      await supabase.from("order_items").insert(orderItems);

      // Clear cart
      await supabase.from("cart_items").delete().eq("user_id", user!.id);

      // Send WhatsApp message
      const orderSummary = cartItems
        .map(
          (item) =>
            `• ${item.product?.name} - Qty: ${item.quantity} - ₹${(
              (item.product?.price || 0) * item.quantity
            ).toLocaleString()}`
        )
        .join("\n");

      const message = `🙏 *New Order from Kanha Collection* 🙏

*Customer Details:*
Name: ${customerInfo.name}
Phone: ${customerInfo.phone}
Address: ${customerInfo.address}

*Order Items:*
${orderSummary}

*Total Amount: ₹${total.toLocaleString()}*

Please confirm the order. 🕉️`;

      const whatsappUrl = `https://wa.me/918544737965?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");

      // Redirect to orders page
      router.push("/orders");
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center py-16">
            <ShoppingBag className="w-24 h-24 text-gray-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-8">
              Add some divine products to get started
            </p>
            <a
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-3 rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 font-semibold"
            >
              Continue Shopping
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center py-6 border-b border-gray-200 last:border-b-0"
                >
                  <Image
                    src={item.product?.image || ""}
                    alt={item.product?.name || ""}
                    width={80}
                    height={80}
                    className="w-20 h-20 object-cover rounded-lg"
                  />

                  <div className="flex-1 ml-6">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.product?.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {item.product?.description}
                    </p>
                    <p className="text-orange-600 font-bold text-lg">
                      ₹{item.product?.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold text-lg w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 hover:bg-red-100 text-red-500 rounded-full transition-colors ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>
                      ₹
                      {(
                        (item.product?.price || 0) * item.quantity
                      ).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-orange-600">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-800">
                  Customer Information
                </h3>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={customerInfo.phone}
                  onChange={(e) =>
                    setCustomerInfo({ ...customerInfo, phone: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Delivery Address"
                  value={customerInfo.address}
                  onChange={(e) =>
                    setCustomerInfo({
                      ...customerInfo,
                      address: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center space-x-2 font-semibold"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Order via WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
