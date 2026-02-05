"use client"

import { useEffect, useRef, useState } from "react"
import { Send } from "lucide-react"

interface AssistantProps {
  isDarkMode?: boolean
}

type SourceRef = {
  id: string
  title: string
  type: string
  url?: string
  source: string
}

type Message = {
  id: string
  role: "assistant" | "user"
  content: string
  sources?: SourceRef[]
}

const initialMessage =
  "Hi! I'm Joydeep's portfolio assistant. Ask me anything about his background, projects, skills, or experience."

export default function Assistant({ isDarkMode = true }: AssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: "intro", role: "assistant", content: initialMessage },
  ])
  const [input, setInput] = useState("")
  const [isSending, setIsSending] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSend = async () => {
    const prompt = input.trim()
    if (!prompt || isSending) return

    const userId = crypto.randomUUID()
    const pendingId = crypto.randomUUID()

    setMessages((prev) => [
      ...prev,
      { id: userId, role: "user", content: prompt },
      { id: pendingId, role: "assistant", content: "Thinking..." },
    ])
    setInput("")
    setIsSending(true)

    try {
      const response = await fetch("/api/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: prompt }),
      })

      const data = (await response.json()) as {
        answer?: string
        sources?: SourceRef[]
        error?: string
      }

      if (!response.ok) {
        throw new Error(data?.error || "Request failed")
      }

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId
            ? {
                ...msg,
                content: data.answer || "Not found in my profile information.",
                sources: data.sources || [],
              }
            : msg,
        ),
      )
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sorry, I could not process that request."
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId
            ? {
                ...msg,
                content: message,
              }
            : msg,
        ),
      )
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  const containerBg = isDarkMode ? "bg-white/10" : "bg-white/70"
  const panelBg = isDarkMode ? "bg-gradient-to-b from-white/15 to-white/5" : "bg-white/80"
  const assistantBubble = isDarkMode ? "bg-white/20 text-white" : "bg-white text-gray-900"
  const userBubble = isDarkMode ? "bg-white/10 text-white" : "bg-gray-200 text-gray-900"
  const inputBg = isDarkMode ? "bg-white/10 text-white" : "bg-white text-gray-900"
  const inputPlaceholder = isDarkMode ? "placeholder:text-white/70" : "placeholder:text-gray-500"

  return (
    <div className={`h-full w-full ${containerBg}`}>
      <div className={`h-full w-full flex flex-col ${panelBg} backdrop-blur-2xl`}>
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-lg ${
                  message.role === "user" ? userBubble : assistantBubble
                }`}
              >
                <p>{message.content}</p>
                {message.sources && message.sources.length > 0 && message.role === "assistant" && (
                  <div className={`mt-2 text-xs ${isDarkMode ? "text-white/60" : "text-gray-500"}`}>
                    Sources: {message.sources.map((source) => source.title).filter(Boolean).join(", ")}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        <div className={`border-t ${isDarkMode ? "border-white/10" : "border-gray-300"} px-4 py-3`}>
          <div className={`flex items-center gap-2 rounded-xl px-3 py-2 ${inputBg}`}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about Joydeep..."
              className={`flex-1 bg-transparent outline-none text-sm ${inputPlaceholder}`}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={isSending}
              className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${
                isDarkMode ? "bg-white/10 hover:bg-white/20" : "bg-gray-200 hover:bg-gray-300"
              } ${isSending ? "opacity-60 cursor-not-allowed" : ""}`}
            >
              <Send className={`${isDarkMode ? "text-white" : "text-gray-800"}`} size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
