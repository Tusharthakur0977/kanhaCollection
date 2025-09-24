import Link from 'next/link'
import { ArrowRight, Sparkles, Heart } from 'lucide-react'

export default function Hero() {
  return (
    <div className="relative bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-50 py-20 overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMiIgZmlsbD0icmdiYSgyNTUsIDE2NSwgMCwgMC4xKSIvPgo8L3N2Zz4K')] opacity-30"></div>
      
      {/* Floating Animation Elements */}
      <div className="absolute top-10 left-10 w-4 h-4 bg-orange-300 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute top-20 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-pulse opacity-50"></div>
      <div className="absolute bottom-20 left-20 w-3 h-3 bg-orange-400 rounded-full animate-ping opacity-40"></div>
      <div className="absolute bottom-10 right-10 w-5 h-5 bg-yellow-300 rounded-full animate-bounce opacity-50" style={{animationDelay: '1s'}}></div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-orange-500 mr-3 animate-spin" style={{animationDuration: '3s'}} />
            <h1 className="text-5xl md:text-6xl font-bold text-gray-800 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              Kanha Collection
            </h1>
            <Sparkles className="w-8 h-8 text-orange-500 ml-3 animate-spin" style={{animationDuration: '3s', animationDirection: 'reverse'}} />
          </div>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed animate-slide-up" style={{animationDelay: '0.5s'}}>
            Discover sacred treasures for your spiritual journey. From divine Krishna idols 
            to complete pooja essentials - everything blessed for your devotion.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{animationDelay: '1s'}}>
            <Link
              href="/products"
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full hover:from-orange-600 hover:to-yellow-600 transition-all duration-300 flex items-center space-x-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/about"
              className="border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-300 font-semibold transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up" style={{animationDelay: '1.5s'}}>
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '2s'}}>
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Authentic Products</h3>
              <p className="text-gray-600">Handpicked sacred items blessed with tradition</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '2.5s'}}>
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-gray-600">Crafted with devotion and attention to detail</p>
            </div>
            <div className="text-center transform hover:scale-105 transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce" style={{animationDelay: '3s'}}>
                <ArrowRight className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Easy Ordering</h3>
              <p className="text-gray-600">Simple checkout process with secure payment</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}