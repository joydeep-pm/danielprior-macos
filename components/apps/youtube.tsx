"use client"

import { useEffect, useRef } from "react"

interface YouTubeProps {
  isDarkMode?: boolean
}

export default function YouTube({ isDarkMode = true }: YouTubeProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const hasOpenedRef = useRef(false)
  const youtubeUrl = ""

  // Open YouTube channel when the app is opened (if configured)
  useEffect(() => {
    // Only open once
    if (!hasOpenedRef.current && youtubeUrl) {
      hasOpenedRef.current = true
      // Open in new tab
      window.open(youtubeUrl, "_blank")
    }
  }, [youtubeUrl])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center">
        <img src="/youtube.png" alt="YouTube" className="w-16 h-16 mx-auto mb-4 object-contain" />
        <h2 className="text-xl font-semibold mb-2">
          {youtubeUrl ? "Opening YouTube..." : "YouTube Not Configured"}
        </h2>
        <p>
          {youtubeUrl ? "Redirecting to your YouTube channel" : "Add your channel URL in components/apps/youtube.tsx"}
        </p>
      </div>
    </div>
  )
}
