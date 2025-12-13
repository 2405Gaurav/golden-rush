"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Candy, Plus, ShoppingCart } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useCart } from "@/components/cart-provider"

export default function MobileNavigation() {
  const { role } = useAuth()
  const { totalItems } = useCart()
  const isAdmin = role === "ADMIN"

  return (
    <div className="h-full bg-white/40 backdrop-blur-md flex flex-col">
      <div className="p-6 border-b-4 border-black">
        <div className="flex items-center gap-2">
          <Candy className="h-6 w-6 text-pink-600" />
          <h2 className="text-2xl font-black">SWEET SHOP</h2>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <nav className="space-y-2 mb-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold p-3 bg-black text-white rounded-xl">
            Dashboard
          </Link>
          <Link href="/sweets" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
            All Sweets
          </Link>
          {!isAdmin && (
            <Link href="/cart" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl relative">
              <ShoppingCart className="h-5 w-5" />
              Cart
              {totalItems > 0 && (
                <span className="bg-red-500 text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-black">
                  {totalItems}
                </span>
              )}
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/inventory"
              className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl"
            >
              Inventory
            </Link>
          )}
          <Link href="/orders" className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl">
            Orders
          </Link>
          {isAdmin && (
            <Link
              href="/analytics"
              className="flex items-center gap-2 text-lg font-bold p-3 hover:bg-black/10 rounded-xl"
            >
              Analytics
            </Link>
          )}
        </nav>

        <div>
          <h2 className="text-xl font-black mb-4">CATEGORIES</h2>
          <div className="space-y-2">
            <Link href="/sweets?category=chocolates">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold bg-transparent"
              >
                🍫 Chocolates
              </Button>
            </Link>
            <Link href="/sweets?category=candies">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold bg-transparent"
              >
                🍬 Candies
              </Button>
            </Link>
            <Link href="/sweets?category=cakes">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold bg-transparent"
              >
                🍰 Cakes
              </Button>
            </Link>
            <Link href="/sweets?category=cookies">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 rounded-xl border-2 border-black font-bold bg-transparent"
              >
                🍪 Cookies
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 border-t-4 border-black">
        <div className="grid grid-cols-2 gap-2">
          <Link href="/sweets/new" className="w-full">
            <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </Link>
          <Button variant="outline" className="rounded-xl border-2 border-black font-bold bg-transparent">
            Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
