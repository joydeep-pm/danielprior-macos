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
      content: `# Daniel Prior
Frontend Developer & Full Stack Engineer

## Skills
### Frontend
- React/Next.js
- Vue.js/Nuxt.js
- TypeScript/JavaScript
- Tailwind CSS/SCSS
- UI/UX Design
- Responsive Web Development
- Vite/Webpack

### Backend
- Node.js/Express
- PHP/Laravel
- Python/Django
- Rust (learning)
- SQL (MySQL, PostgreSQL)
- NoSQL (MongoDB)
- RESTful APIs/GraphQL

### DevOps & Tools
- Docker/Containerization
- CI/CD Pipelines
- Git/GitHub
- Agile/Scrum Methodologies
- AWS/Cloud Services
- Linux/Unix

## Experience
Currently working as a Senior Full Stack Developer, focusing on building accessible, performant, and scalable web applications. Experienced in leading development teams and implementing best practices for modern web development.

## Education
Bachelor of Informations Technology, Aalborg Universitet

## Contact
Email: mail@danielprior.dk
GitHub: github.com/daprior
Portfolio: danielprior.dev`,
      date: "Today, 10:30 AM",
    },
    {
      id: 2,
      title: "Project Ideas",
      content: `# Project Ideas for 2024

1. AI-powered content recommendation system using machine learning
2. Real-time collaborative whiteboard app with WebSockets
3. Personal finance tracker with ML insights and data visualization
4. Interactive portfolio website with 3D elements using Three.js
5. Cross-platform mobile app with React Native
6. Microservices architecture with Docker and Kubernetes
7. Blockchain-based authentication system
8. IoT home automation dashboard with real-time monitoring`,
      date: "Yesterday, 3:15 PM",
    },
    {
      id: 3,
      title: "Learning Goals",
      content: `# Learning Goals

- Master Three.js and WebGL for interactive 3D web experiences
- Deepen knowledge of system design and architecture patterns
- Advance Rust programming skills for performance-critical applications
- Explore AI/ML frameworks and practical applications
- Study UX research methodologies and accessibility standards
- Learn WebAssembly for high-performance web applications
- Explore serverless architecture and edge computing
- Contribute more to open-source projects`,
      date: "Mar 15, 2024",
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
