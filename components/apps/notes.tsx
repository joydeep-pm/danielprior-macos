"use client"

import type React from "react"

import { useState } from "react"

interface NotesProps {
  isDarkMode?: boolean
}

export default function Notes({ isDarkMode = true }: NotesProps) {
  // Update the notes state with enhanced content
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "About Me",
      content: `# Joydeep Sarkar
Product Management Leader | Fintech and Digital Lending

## Summary
Experienced product leader with 5+ years in fintech and e-commerce, specializing in digital lending. Led 0-to-1 and 1-to-10 initiatives that delivered 3x YoY revenue growth and 2M+ active users.

## Core Strengths
- Product strategy and roadmap ownership
- API-first lending platforms (LOS/LMS)
- Go-to-market and scale for B2B and B2C lending
- Data-driven growth and revenue optimization
- Cross-functional leadership and execution

## Contact
Email: joytdh@gmail.com
Phone: +91 877-771-7039
Location: Bengaluru, India
Website: joydeepsarkar.me
LinkedIn: linkedin.com/in/joydeepsarkar1987/
GitHub: github.com/joydeep-pm`,
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      title: "Experience Highlights",
      content: `# Experience Highlights

## Director - Core Lending Suite, M2P Fintech (Nov 2024 - Present)
- Led product vision for an API-first, low-code lending platform serving 15+ institutions
- Launched co-lending module and reconciliation systems processing $50M+ loan volume
- Built Loan Against Securities product supporting a $200M+ portfolio

## Director - Product, Lending, Paytm (Nov 2022 - Nov 2024)
- Drove 4x YoY loan disbursals through LMS strategy and execution
- Reduced billing cycle time by 65% with automated revenue data products
- Orchestrated partner integrations securing INR 1500Cr+ monthly disbursal capital

## Lead Product Manager, Finvolv (Dec 2021 - Oct 2022)
- Achieved 3x ARR growth and 27% quarterly revenue growth
- Delivered API-first lending stack deployed across 12+ institutions
- Built underwriting engine improving approvals by 45%

## Education
- EPGP (1-Year MBA) - IIM Bangalore
- B.Tech (Electrical Engineering) - WBUT`,
      date: "Yesterday, 3:15 PM",
    },
  ])

  const [selectedNoteId, setSelectedNoteId] = useState(1)
  const [editableContent, setEditableContent] = useState("")

  const selectedNote = notes.find((note) => note.id === selectedNoteId)

  const handleNoteSelect = (id: number) => {
    setSelectedNoteId(id)
    const note = notes.find((n) => n.id === id)
    if (note) {
      setEditableContent(note.content)
    }
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableContent(e.target.value)

    // Update the note content
    setNotes(
      notes.map((note) => {
        if (note.id === selectedNoteId) {
          return { ...note, content: e.target.value }
        }
        return note
      }),
    )
  }

  const textColor = isDarkMode ? "text-white" : "text-gray-800"
  const bgColor = isDarkMode ? "bg-gray-900" : "bg-white"
  const sidebarBg = isDarkMode ? "bg-gray-800" : "bg-gray-100"
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200"
  const hoverBg = isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"
  const selectedBg = isDarkMode ? "bg-gray-700" : "bg-gray-300"

  return (
    <div className={`flex h-full ${bgColor} ${textColor}`}>
      {/* Sidebar */}
      <div className={`w-64 ${sidebarBg} border-r ${borderColor} flex flex-col`}>
        <div className="p-3 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-medium">Notes</h2>
          <button className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto flex-1">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 cursor-pointer ${selectedNoteId === note.id ? selectedBg : hoverBg}`}
              onClick={() => handleNoteSelect(note.id)}
            >
              <h3 className="font-medium truncate">{note.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{note.date}</p>
              <p className={`text-sm mt-1 truncate ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                {note.content.split("\n")[0].replace(/^#+ /, "")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Note content */}
      <div className="flex-1 flex flex-col">
        {selectedNote && (
          <>
            <div className={`p-3 border-b ${borderColor}`}>
              <h2 className="font-medium">{selectedNote.title}</h2>
              <p className="text-xs text-gray-500">{selectedNote.date}</p>
            </div>
            <div className="flex-1 p-4 overflow-auto">
              <textarea
                className={`w-full h-full resize-none ${bgColor} ${textColor} focus:outline-none`}
                value={selectedNote.content}
                onChange={handleContentChange}
              />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
