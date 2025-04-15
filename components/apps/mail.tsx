"use client"

import { useEffect } from "react"
import { Mail } from "lucide-react"

interface MailProps {
  isDarkMode?: boolean
}

export default function MailApp({ isDarkMode = true }: MailProps) {
  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"

  // Open mailto link when the app is opened
  useEffect(() => {
    // You can customize the email address, subject, and body here
    const mailtoLink =
      "mailto:mail@danielprior.dk?subject=Contact%20from%20Portfolio&body=Hello%2C%0A%0AI%20visited%20your%20portfolio%20and%20would%20like%20to%20connect."
    window.open(mailtoLink, "_blank")
  }, [])

  return (
    <div className={`h-full ${bgColor} ${textColor} p-6 flex items-center justify-center`}>
      <div className="text-center">
        <Mail className="w-16 h-16 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Opening Mail...</h2>
        <p>Redirecting to your default mail application</p>
      </div>
    </div>
  )
}
