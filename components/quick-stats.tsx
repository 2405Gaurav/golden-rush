"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingCart, TrendingUp, Candy } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { apiFetch, type Sweet } from "@/lib/api"

const ORDERS_STORAGE_KEY = "sweetshop.orders"
const REVENUE_STORAGE_KEY = "sweetshop.revenue"
const LAST_RESET_KEY = "sweetshop.lastReset"

function getTodayKey() {
  return new Date().toISOString().split("T")[0] // YYYY-MM-DD
}

function getOrdersToday(): number {
  const today = getTodayKey()
  const lastReset = localStorage.getItem(LAST_RESET_KEY)
  
  // Reset if it's a new day
  if (lastReset !== today) {
    localStorage.setItem(ORDERS_STORAGE_KEY, "0")
    localStorage.setItem(REVENUE_STORAGE_KEY, "0")
    localStorage.setItem(LAST_RESET_KEY, today)
    return 0
  }
  
  return parseInt(localStorage.getItem(ORDERS_STORAGE_KEY) || "0", 10)
}

function getRevenueToday(): number {
  const today = getTodayKey()
  const lastReset = localStorage.getItem(LAST_RESET_KEY)
  
  if (lastReset !== today) {
    return 0
  }
  
  return parseFloat(localStorage.getItem(REVENUE_STORAGE_KEY) || "0")
}

export function trackPurchase(amount: number) {
  const today = getTodayKey()
  const lastReset = localStorage.getItem(LAST_RESET_KEY)
  
  if (lastReset !== today) {
    localStorage.setItem(ORDERS_STORAGE_KEY, "1")
    localStorage.setItem(REVENUE_STORAGE_KEY, amount.toString())
    localStorage.setItem(LAST_RESET_KEY, today)
  } else {
    const currentOrders = parseInt(localStorage.getItem(ORDERS_STORAGE_KEY) || "0", 10)
    const currentRevenue = parseFloat(localStorage.getItem(REVENUE_STORAGE_KEY) || "0")
    localStorage.setItem(ORDERS_STORAGE_KEY, (currentOrders + 1).toString())
    localStorage.setItem(REVENUE_STORAGE_KEY, (currentRevenue + amount).toFixed(2))
  }
  
  // Trigger storage event for other tabs/components
  window.dispatchEvent(new Event("storage"))
}

export default function QuickStats() {
  const { token, isReady } = useAuth()
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [ordersToday, setOrdersToday] = useState(0)
  const [revenueToday, setRevenueToday] = useState(0)

  useEffect(() => {
    if (!isReady || !token) return

    // Fetch sweets data
    ;(async () => {
      try {
        const data = await apiFetch<Sweet[]>("/api/sweets", { token })
        setSweets(data)
      } catch (e) {
        console.error("Failed to load sweets:", e)
      }
    })()

    // Load orders and revenue
    setOrdersToday(getOrdersToday())
    setRevenueToday(getRevenueToday())

    // Listen for storage changes (from other tabs or components)
    const handleStorageChange = () => {
      setOrdersToday(getOrdersToday())
      setRevenueToday(getRevenueToday())
    }
    window.addEventListener("storage", handleStorageChange)
    
    // Also listen for custom events
    window.addEventListener("purchase", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("purchase", handleStorageChange)
    }
  }, [isReady, token])

  // Re-fetch sweets periodically to get updated stock
  useEffect(() => {
    if (!token) return
    
    const interval = setInterval(async () => {
      try {
        const data = await apiFetch<Sweet[]>("/api/sweets", { token })
        setSweets(data)
      } catch (e) {
        // Silently fail
      }
    }, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [token])

  const totalProducts = sweets.length
  const lowStock = sweets.filter((s) => s.quantity <= 10).length

  const stats = [
    {
      title: "Total Products",
      value: totalProducts.toString(),
      icon: <Package className="h-6 w-6" />,
      color: "bg-blue-400",
    },
    {
      title: "Orders Today",
      value: ordersToday.toString(),
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-green-400",
    },
    {
      title: "Revenue",
      value: `₹${revenueToday.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-yellow-400",
    },
    {
      title: "Low Stock",
      value: lowStock.toString(),
      icon: <Candy className="h-6 w-6" />,
      color: "bg-red-400",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white border-4 border-black rounded-2xl p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
        >
          <div
            className={`${stat.color} w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3`}
          >
            {stat.icon}
          </div>
          <p className="text-sm font-bold text-gray-600 mb-1">{stat.title}</p>
          <p className="text-2xl font-black">{stat.value}</p>
        </div>
      ))}
    </div>
  )
}
