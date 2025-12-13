"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Candy, ShoppingCart, Sparkles, Heart, ArrowRight, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-7xl h-full max-h-[90vh] backdrop-blur-xl bg-white/30 border-4 border-black rounded-3xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
        {/* Header */}
        <header className="border-b-4 border-black p-4 bg-white/40 backdrop-blur-md flex-shrink-0">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Candy className="h-8 w-8 sm:h-10 sm:w-10 text-pink-600" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
                SWEET SHOP
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Link href="/login">
                <Button
                  variant="outline"
                  className="rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent text-sm sm:text-base px-3 sm:px-4"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-sm sm:text-base px-3 sm:px-4">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content - Fits in one screen */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6 md:p-8">
          <div className="h-full grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Left Side - Hero Text */}
            <div className="flex flex-col justify-center">
              <div className="inline-block bg-pink-200 border-4 border-black rounded-2xl px-3 py-1.5 mb-4 w-fit">
                <span className="text-sm sm:text-base font-black flex items-center gap-2">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  SWEETEST TREATS
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight">
                INDULGE IN
                <br />
                <span className="text-pink-600">DELICIOUS</span>
                <br />
                SWEETS
              </h2>
              <p className="text-base sm:text-lg font-bold text-gray-700 mb-6">
                Handcrafted chocolates, candies, cakes & cookies. Made with love!
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register">
                  <Button className="w-full sm:w-auto h-12 bg-black hover:bg-black/90 text-white rounded-xl border-2 border-black font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-base px-6">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Start Shopping
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto h-12 rounded-xl border-2 border-black font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-transparent text-base px-6"
                  >
                    Browse
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Side - Image Grid */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {[
                { emoji: "🍫", name: "Chocolates", image: "/chocolate-truffles.png", color: "bg-blue-400" },
                { emoji: "🍬", name: "Candies", image: "/colorful-gummy-bears.jpg", color: "bg-green-400" },
                { emoji: "🍰", name: "Cakes", image: "/strawberry-cupcakes.jpg", color: "bg-yellow-400" },
                { emoji: "🍪", name: "Cookies", image: "/chocolate-chip-cookies.png", color: "bg-pink-400" },
              ].map((category) => (
                <div
                  key={category.name}
                  className="bg-white border-4 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-x-1 hover:-translate-y-1 flex flex-col"
                >
                  <div className="relative w-full flex-1 min-h-[100px] border-b-4 border-black">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2 sm:p-3 flex items-center gap-2">
                    <div className={`${category.color} w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center flex-shrink-0`}>
                      <span className="text-lg">{category.emoji}</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-black">{category.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Features Bar */}
        <div className="border-t-4 border-black p-3 sm:p-4 bg-white/40 backdrop-blur-md flex-shrink-0">
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              { icon: Sparkles, text: "Fresh", color: "bg-blue-400" },
              { icon: Heart, text: "Love", color: "bg-green-400" },
              { icon: Star, text: "Quality", color: "bg-yellow-400" },
              { icon: ShoppingCart, text: "Easy", color: "bg-pink-400" },
            ].map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className={`${feature.color} w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 border-black flex items-center justify-center mx-auto mb-1 sm:mb-2`}>
                  <feature.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <p className="text-xs sm:text-sm font-black">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

