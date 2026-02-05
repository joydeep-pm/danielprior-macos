"use client"

interface AboutProps {
  isDarkMode?: boolean
}

export default function About({ isDarkMode = true }: AboutProps) {
  const bgClass = isDarkMode ? "bg-white/10 text-white" : "bg-white text-gray-900"
  const mutedClass = isDarkMode ? "text-white/70" : "text-gray-600"

  return (
    <div className="h-full w-full p-6">
      <div className={`h-full w-full rounded-2xl ${bgClass} backdrop-blur-xl p-6`}>
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/10 flex items-center justify-center">
            <img src="/joydeep-avatar.png" alt="Joydeep Sarkar" className="h-14 w-14 rounded-xl object-cover" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">About Joydeep</h2>
            <p className={`mt-1 ${mutedClass}`}>Fintech Product Leader & Lending Infrastructure Specialist</p>
          </div>
        </div>

        <div className={`mt-6 space-y-4 text-sm leading-relaxed ${mutedClass}`}>
          <p>
            12+ years across traditional banking and high-growth fintech. Focused on building API-first lending platforms,
            co-lending orchestration, and compliance-ready systems that scale.
          </p>
          <p>
            Led 0-to-1 and 1-to-10 initiatives delivering 4x YoY growth, $200M+ portfolios, and ₹1500Cr+ monthly disbursals.
          </p>
          <p>
            Open to product leadership roles and fintech collaborations.
          </p>
        </div>
      </div>
    </div>
  )
}
