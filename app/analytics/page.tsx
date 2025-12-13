import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Candy, Menu, TrendingUp, DollarSign, ShoppingBag, Users } from "lucide-react"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AnalyticsPage() {
  const topProducts = [
    { name: "Chocolate Truffles", sales: 245, revenue: 3183.55 },
    { name: "Rainbow Lollipops", sales: 189, revenue: 565.11 },
    { name: "Gummy Bears", sales: 156, revenue: 934.44 },
    { name: "Strawberry Cupcakes", sales: 142, revenue: 1207.0 },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-7xl mx-auto backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        <header className="border-b-4 border-black p-4 sm:p-6 bg-white/40 backdrop-blur-md">
          <div className="flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Candy className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
              <Link href="/">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight hover:text-pink-600 transition-colors">
                  SWEET SHOP
                </h1>
              </Link>
            </div>

            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-xl border-2 border-black bg-transparent">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="border-r-4 border-black p-0">
                  <MobileNavigation />
                </SheetContent>
              </Sheet>
            </div>

            <div className="hidden sm:flex items-center gap-3">
              <Link href="/">
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent"
                >
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl sm:text-3xl font-black mb-6">ANALYTICS</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-blue-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                <DollarSign className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">Total Revenue</p>
              <p className="text-3xl font-black">₹12,456</p>
              <p className="text-sm font-bold text-green-600 mt-2">↑ 12% from last month</p>
            </div>

            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-green-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">Total Orders</p>
              <p className="text-3xl font-black">856</p>
              <p className="text-sm font-bold text-green-600 mt-2">↑ 8% from last month</p>
            </div>

            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-yellow-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                <Users className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">New Customers</p>
              <p className="text-3xl font-black">124</p>
              <p className="text-sm font-bold text-green-600 mt-2">↑ 23% from last month</p>
            </div>

            <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-pink-400 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center mb-3">
                <TrendingUp className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-3xl font-black">₹14.55</p>
              <p className="text-sm font-bold text-green-600 mt-2">↑ 5% from last month</p>
            </div>
          </div>

          <div className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black mb-6">TOP SELLING PRODUCTS</h3>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-pink-50 border-2 border-black rounded-xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-500 text-white w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center font-black">
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="text-lg font-black">{product.name}</h4>
                      <p className="font-bold text-gray-600">{product.sales} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black">₹{product.revenue.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
