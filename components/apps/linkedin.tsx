"use client"

import { useEffect, useRef } from "react"
import { Linkedin } from "lucide-react"

interface LinkedInProps {
  isDarkMode?: boolean
}

export default function LinkedInApp({ isDarkMode = true }: LinkedInProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const hasOpenedRef = useRef(false)

  useEffect(() => {
    if (!hasOpenedRef.current) {
      hasOpenedRef.current = true
      window.open("https://www.linkedin.com/in/joydeepsarkar1987/", "_blank")
    }
  }, [])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center">
        <Linkedin className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Opening LinkedIn...</h2>
        <p>Redirecting to your LinkedIn profile</p>
      </div>
    </div>
  )
}
