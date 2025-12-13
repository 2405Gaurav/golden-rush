"use client"

import { Button } from "@/components/ui/button"
import { Edit, ShoppingCart, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useCart } from "@/components/cart-provider"
import type { Sweet } from "@/lib/api"
import { toast } from "sonner"
import { getImageForCategory } from "@/lib/image-utils"

interface SweetCardProps {
  id: string
  name: string
  category: string
  price: number
  stock: number
  image: string
  canAdmin?: boolean
  onDelete?: () => void
  onPurchase?: () => void
  sweet?: Sweet // Pass full sweet object for cart
}

export default function SweetCard({
  id,
  name,
  category,
  price,
  stock,
  image,
  canAdmin = false,
  onDelete,
  onPurchase,
  sweet,
}: SweetCardProps) {
  const { addItem } = useCart()
  const stockColor = stock > 50 ? "bg-green-500" : stock > 20 ? "bg-yellow-500" : "bg-red-500"
  
  // Auto-select image based on category if not provided
  const displayImage = image && image !== "/placeholder.jpg" 
    ? image 
    : getImageForCategory(category, name)

  function handleAddToCart() {
    if (!sweet) {
      // Fallback to onPurchase if sweet object not provided
      onPurchase?.()
      return
    }
    if (stock <= 0) {
      toast.error("This item is out of stock")
      return
    }
    addItem(sweet, 1)
    toast.success(`${name} added to cart!`)
  }

  return (
    <div className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1">
      <div className="relative w-full h-40 mb-4 rounded-xl overflow-hidden border-2 border-black">
        <Image src={displayImage} alt={name} fill className="object-cover" />
        <div
          className={`absolute top-2 right-2 ${stockColor} text-white px-3 py-1 rounded-lg border-2 border-black font-bold text-sm`}
        >
          Stock: {stock}
        </div>
      </div>

      <div className="mb-2">
        <span className="inline-block bg-pink-200 border-2 border-black rounded-lg px-3 py-1 text-xs font-bold mb-2">
          {category}
        </span>
      </div>

      <h3 className="text-xl font-black mb-2">{name}</h3>
      <p className="text-2xl font-black mb-4">₹{price.toFixed(2)}</p>

      <div className="flex gap-2 items-stretch w-full max-w-full">
        {!canAdmin && (
          <Button
            onClick={handleAddToCart}
            disabled={stock <= 0}
            className="flex-1 bg-black hover:bg-black/90 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60 min-w-0"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {stock <= 0 ? "Sold out" : "Add to Cart"}
          </Button>
        )}
        {canAdmin && onPurchase && (
          <Button
            onClick={onPurchase}
            disabled={stock <= 0}
            className="flex-1 bg-black hover:bg-black/90 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:opacity-60 min-w-0"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {stock <= 0 ? "Sold out" : "Purchase"}
          </Button>
        )}

        {canAdmin && (
          <>
            <Link href={`/sweets/${id}`} className="flex-1 min-w-0">
              <Button className="w-full h-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <div className="flex-shrink-0">
              <Button
                onClick={onDelete}
                variant="outline"
                className="h-auto min-h-[42px] w-[42px] px-0 rounded-xl border-2 border-black font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:bg-red-500 hover:text-white bg-transparent flex items-center justify-center"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
