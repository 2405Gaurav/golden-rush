import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Candy, Menu, Clock, CheckCircle, XCircle } from "lucide-react"
import MobileNavigation from "@/components/mobile-navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function OrdersPage() {
  const orders = [
    { id: "#ORD-001", customer: "Sarah Johnson", items: 3, total: 24.97, status: "pending", time: "10 mins ago" },
    { id: "#ORD-002", customer: "Mike Chen", items: 5, total: 42.45, status: "completed", time: "25 mins ago" },
    { id: "#ORD-003", customer: "Emma Wilson", items: 2, total: 17.98, status: "completed", time: "1 hour ago" },
    { id: "#ORD-004", customer: "James Brown", items: 4, total: 31.96, status: "pending", time: "2 hours ago" },
    { id: "#ORD-005", customer: "Lisa Davis", items: 1, total: 12.99, status: "cancelled", time: "3 hours ago" },
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
          <h2 className="text-2xl sm:text-3xl font-black mb-6">ORDERS</h2>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white border-4 border-black rounded-2xl p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="bg-pink-200 w-12 h-12 rounded-xl border-2 border-black flex items-center justify-center">
                      <span className="font-black text-lg">{order.items}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-black">{order.id}</h3>
                      <p className="font-bold text-gray-600">{order.customer}</p>
                      <p className="font-bold text-sm text-gray-500">{order.time}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-black">${order.total.toFixed(2)}</p>
                      {order.status === "pending" && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span className="inline-block bg-yellow-400 px-3 py-1 rounded-lg border-2 border-black font-bold text-sm">
                            Pending
                          </span>
                        </div>
                      )}
                      {order.status === "completed" && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="inline-block bg-green-400 px-3 py-1 rounded-lg border-2 border-black font-bold text-sm">
                            Completed
                          </span>
                        </div>
                      )}
                      {order.status === "cancelled" && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span className="inline-block bg-red-400 px-3 py-1 rounded-lg border-2 border-black font-bold text-sm">
                            Cancelled
                          </span>
                        </div>
                      )}
                    </div>

                    <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      View Details
                    </Button>
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
