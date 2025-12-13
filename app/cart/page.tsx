"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Candy, ShoppingCart, Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"
import { apiFetch } from "@/lib/api"
import { toast } from "sonner"
import { trackPurchase } from "@/components/quick-stats"

export default function CartPage() {
  const router = useRouter()
  const { token, isReady } = useAuth()
  const { items, removeItem, updateQuantity, clearCart, totalPrice } = useCart()
  const [processing, setProcessing] = useState(false)

  if (!isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8 flex items-center justify-center">
        <div className="text-xl font-bold">Loading...</div>
      </div>
    )
  }

  if (!token) {
    router.push("/login")
    return null
  }

  async function handleCheckout() {
    if (!token || items.length === 0) return

    setProcessing(true)
    const errors: string[] = []
    
    try {
      let totalRevenue = 0
      
      // Process each item in the cart
      for (const item of items) {
        try {
          await apiFetch(`/api/sweets/${item.sweet.id}/purchase`, {
            method: "POST",
            token,
            body: JSON.stringify({ quantity: item.quantity }),
          })
          // Track revenue for this purchase
          const itemTotal = parseFloat(item.sweet.price) * item.quantity
          totalRevenue += itemTotal
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Failed to purchase item"
          errors.push(`${item.sweet.name}: ${errorMsg}`)
        }
      }

      if (errors.length > 0) {
        toast.error(`Some items failed: ${errors.join(", ")}`)
      } else {
        // Track the purchase for dashboard stats
        trackPurchase(totalRevenue)
        // Trigger custom event for real-time updates
        window.dispatchEvent(new CustomEvent("purchase"))
        
        toast.success("Order placed successfully!")
        clearCart()
        router.push("/sweets")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed")
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <ShoppingCart className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
              <Link href="/">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:text-pink-600 transition-colors">
                  SHOPPING CART
                </h1>
              </Link>
            </div>
            <Link href="/sweets">
              <Button
                variant="outline"
                className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8">
          {items.length === 0 ? (
            <div className="bg-white border-4 border-black rounded-2xl p-12 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-black mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6 font-bold">Add some sweets to get started!</p>
              <Link href="/sweets">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Browse Sweets
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div
                    key={item.sweet.id}
                    className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex-1">
                        <h3 className="text-xl font-black mb-1">{item.sweet.name}</h3>
                        <p className="text-gray-600 font-bold">{item.sweet.category}</p>
                        <p className="text-lg font-black text-pink-600 mt-2">
                          ${parseFloat(item.sweet.price).toFixed(2)} each
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 border-2 border-black rounded-xl p-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.sweet.id, item.quantity - 1)}
                            className="h-8 w-8 rounded-lg border-2 border-black"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="font-black text-lg min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.sweet.id, item.quantity + 1)}
                            className="h-8 w-8 rounded-lg border-2 border-black"
                            disabled={item.quantity >= item.sweet.quantity}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="text-right min-w-[100px]">
                          <p className="text-lg font-black">
                            ${(parseFloat(item.sweet.price) * item.quantity).toFixed(2)}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.sweet.id)}
                          className="h-10 w-10 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-2xl font-black">Total:</span>
                  <span className="text-3xl font-black text-pink-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={handleCheckout}
                    disabled={processing}
                    className="flex-1 h-14 bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-lg"
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    {processing ? "Processing..." : "Checkout"}
                  </Button>
                  <Button
                    onClick={clearCart}
                    variant="outline"
                    className="h-14 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

