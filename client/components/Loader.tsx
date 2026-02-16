import { useState, useEffect } from 'react'
import SExlogo from '/logo_spritErax.jpeg'

export function Loader() {
  const [dots, setDots] = useState(3)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev >= 3 ? 1 : prev + 1))
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex flex-col items-center justify-center text-white">
      {/* Logo */}
      <div className="mb-8">
        <img 
          src={SExlogo} 
          alt="SpiritEraX Logo" 
          className="w-32 h-32 object-contain"
        />
      </div>

      {/* Loading text */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-semibold mb-2">Igniting Your Spirit...</h1>
        <p className="text-lg opacity-80">Please wait{'.'.repeat(dots)}</p>
      </div>

      {/* Loading animation - circular dots */}
      <div className="relative w-16 h-16 mb-8">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse delay-75"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full animate-pulse delay-150"></div>
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-2 h-2 bg-white rounded-full animate-pulse delay-300"></div>
      </div>

      {/* Footer text */}
      <div className="absolute bottom-8 text-sm opacity-60">
        Powered by SpiritEraX
      </div>
    </div>
  )
}
