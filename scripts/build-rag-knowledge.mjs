#!/usr/bin/env node
import fs from "fs"
import path from "path"
import os from "os"
import { execFileSync } from "child_process"

const args = process.argv.slice(2)
const options = {}
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i]
  if (!arg.startsWith("--")) continue
  const key = arg.slice(2)
  const next = args[i + 1]
  if (next && !next.startsWith("--")) {
    options[key] = next
    i += 1
  } else {
    options[key] = true
  }
}

const websiteRoot = options.website ? path.resolve(options.website) : null
const resumePath = options.resume ? path.resolve(options.resume) : null
const outPath = path.resolve(options.out || "data/rag/knowledge.json")

if (!websiteRoot || !fs.existsSync(websiteRoot)) {
  console.error("Missing or invalid --website path.")
  process.exit(1)
}

function stripJsx(input) {
  return input
    .replace(/\{\s*['"]\s*['"]\s*\}/g, " ")
    .replace(/\{[^}]*\}/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function parseFrontMatter(raw) {
  if (!raw.startsWith("---")) {
    return { data: {}, content: raw }
  }

  const endIndex = raw.indexOf("\n---", 3)
  if (endIndex === -1) {
    return { data: {}, content: raw }
  }

  const frontMatter = raw.slice(3, endIndex).trim()
  const content = raw.slice(endIndex + 4).trim()
  const data = {}

  for (const line of frontMatter.split(/\r?\n/)) {
    if (!line.trim() || !line.includes(":")) continue
    const idx = line.indexOf(":")
    const key = line.slice(0, idx).trim()
    let value = line.slice(idx + 1).trim()
    if (!value) continue

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    } else if (value.startsWith("[") && value.endsWith("]")) {
      try {
        value = JSON.parse(value)
      } catch {
        value = value
      }
    } else if (value === "true" || value === "false") {
      value = value === "true"
    }

    data[key] = value
  }

  return { data, content }
}

function splitSections(content) {
  const parts = content.split(/\n##\s+/)
  if (parts.length <= 1) return [content.trim()]
  const sections = []
  if (parts[0].trim()) sections.push(parts[0].trim())
  for (let i = 1; i < parts.length; i += 1) {
    const part = parts[i]
    const lines = part.split(/\r?\n/)
    const heading = lines.shift()?.trim()
    const body = lines.join("\n").trim()
    const sectionText = heading ? `## ${heading}\n${body}`.trim() : body
    if (sectionText) sections.push(sectionText)
  }
  return sections
}

function chunkByLength(text, maxChars = 900) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
  const chunks = []
  let buffer = ""
  for (const paragraph of paragraphs) {
    if (!buffer) {
      buffer = paragraph
      continue
    }
    if (buffer.length + paragraph.length + 1 > maxChars) {
      chunks.push(buffer)
      buffer = paragraph
    } else {
      buffer = `${buffer}\n${paragraph}`
    }
  }
  if (buffer) chunks.push(buffer)
  return chunks
}

const chunks = []

function addChunk(chunk) {
  chunks.push(chunk)
}

function extractHeroAboutSkills() {
  const pagePath = path.join(websiteRoot, "app", "page.tsx")
  if (!fs.existsSync(pagePath)) return
  const page = fs.readFileSync(pagePath, "utf8")

  const heroMatch = page.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)
  const heroText = heroMatch ? stripJsx(heroMatch[1]) : ""

  const paragraphs = [...page.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/g)].map((m) => stripJsx(m[1]))
  const heroParagraph = paragraphs[0] || ""
  const aboutParagraphs = paragraphs.slice(1)

  if (heroText || heroParagraph) {
    addChunk({
      id: "website:hero:0",
      text: [heroText, heroParagraph].filter(Boolean).join("\n"),
      source: "website",
      type: "hero",
      title: "Hero",
      url: "/",
    })
  }

  aboutParagraphs.forEach((text, index) => {
    if (!text) return
    addChunk({
      id: `website:about:${index}`,
      text,
      source: "website",
      type: "about",
      title: "About",
      url: "/",
    })
  })

  const metricsMatch = page.match(/const metrics = \[([\s\S]*?)\];/)
  if (metricsMatch) {
    const metricBlock = metricsMatch[1]
    const metrics = [...metricBlock.matchAll(/number:\s*'([^']+)'\s*,\s*label:\s*'([^']+)'/g)].map(
      (m) => `${m[1]} ${m[2]}`,
    )
    if (metrics.length) {
      addChunk({
        id: "website:metrics:0",
        text: `Key metrics: ${metrics.join("; ")}`,
        source: "website",
        type: "metric",
        title: "Key Metrics",
        url: "/",
      })
    }
  }

  const skillsMatch = page.match(/const skills = \[([\s\S]*?)\];/)
  if (skillsMatch) {
    const skillBlock = skillsMatch[1]
    const skillMatches = [...skillBlock.matchAll(/title:\s*'([^']+)'[\s\S]*?description:\s*\(([\s\S]*?)\),/g)]
    skillMatches.forEach((match, index) => {
      const title = match[1]
      const description = stripJsx(match[2])
      if (!title && !description) return
      addChunk({
        id: `website:skill:${index}`,
        text: description || title,
        source: "website",
        type: "skill",
        title,
        url: "/",
      })
    })
  }
}

function extractContact() {
  const footerPath = path.join(websiteRoot, "components", "Footer.tsx")
  const navPath = path.join(websiteRoot, "components", "Nav.tsx")
  const texts = []

  if (fs.existsSync(footerPath)) texts.push(fs.readFileSync(footerPath, "utf8"))
  if (fs.existsSync(navPath)) texts.push(fs.readFileSync(navPath, "utf8"))

  if (!texts.length) return
  const combined = texts.join("\n")

  const emails = new Set([...combined.matchAll(/mailto:([^"']+)/g)].map((m) => m[1]))
  const links = new Set([...combined.matchAll(/https?:\/\/[^"']+/g)].map((m) => m[0]))

  const contactLines = []
  if (emails.size) contactLines.push(`Email: ${[...emails].join(", ")}`)
  if (links.size) contactLines.push(`Links: ${[...links].join(", ")}`)

  if (contactLines.length) {
    addChunk({
      id: "website:contact:0",
      text: contactLines.join("\n"),
      source: "website",
      type: "contact",
      title: "Contact",
      url: "/#contact",
    })
  }
}

function extractMdxContent(type, dir, urlBuilder) {
  const dirPath = path.join(websiteRoot, dir)
  if (!fs.existsSync(dirPath)) return
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))

  for (const file of files) {
    const filePath = path.join(dirPath, file)
    const raw = fs.readFileSync(filePath, "utf8")
    const { data, content } = parseFrontMatter(raw)
    if (data.draft) continue

    const slug = file.replace(/\.mdx?$/, "")
    const sections = splitSections(content)

    sections.forEach((section, index) => {
      if (!section) return
      const header = [
        data.title ? `Title: ${data.title}` : null,
        data.company ? `Company: ${data.company}` : null,
        data.role ? `Role: ${data.role}` : null,
        data.duration ? `Duration: ${data.duration}` : null,
        data.metric ? `Metric: ${data.metric}` : null,
        data.problem ? `Problem: ${data.problem}` : null,
        data.tags ? `Tags: ${Array.isArray(data.tags) ? data.tags.join(", ") : data.tags}` : null,
      ]
        .filter(Boolean)
        .join("\n")

      addChunk({
        id: `${type}:${slug}:${index}`,
        text: header ? `${header}\n\n${section}` : section,
        source: "website",
        type,
        title: data.title,
        company: data.company,
        role: data.role,
        dates: data.duration,
        tags: Array.isArray(data.tags) ? data.tags : undefined,
        url: urlBuilder ? urlBuilder(slug, data) : undefined,
      })
    })
  }
}

function extractResumeText() {
  if (!resumePath || !fs.existsSync(resumePath)) return ""

  if (resumePath.endsWith(".txt")) {
    return fs.readFileSync(resumePath, "utf8")
  }

  if (resumePath.endsWith(".pdf")) {
    const swiftSource = `
import Foundation
import PDFKit

let url = URL(fileURLWithPath: "${resumePath.replace(/\\/g, "\\\\")}")
guard let doc = PDFDocument(url: url) else {
  exit(1)
}

for i in 0..<doc.pageCount {
  if let page = doc.page(at: i) {
    if let text = page.string {
      print(text)
    }
    print("---PAGE---")
  }
}
`
    const tmpPath = path.join(os.tmpdir(), `pdftext-${Date.now()}.swift`)
    fs.writeFileSync(tmpPath, swiftSource)
    const output = execFileSync("swift", [tmpPath], {
      env: {
        ...process.env,
        CLANG_MODULE_CACHE_PATH: "/tmp/clang-module-cache",
        SWIFT_MODULE_CACHE_PATH: "/tmp/swift-module-cache",
      },
    }).toString("utf8")
    fs.unlinkSync(tmpPath)
    return output
  }

  return fs.readFileSync(resumePath, "utf8")
}

function extractResumeChunks() {
  const resumeText = extractResumeText()
  if (!resumeText) return

  const cleaned = resumeText.replace(/\r/g, "").replace(/---PAGE---/g, "\n")
  const chunked = chunkByLength(cleaned, 900)

  chunked.forEach((text, index) => {
    addChunk({
      id: `resume:${index}`,
      text,
      source: "resume",
      type: "resume",
      title: "Resume",
    })
  })
}

extractHeroAboutSkills()
extractContact()
extractMdxContent("work", "content/work", () => "/work")
extractMdxContent("case-study", "content/case-studies", (slug) => `/case-studies/${slug}`)
extractMdxContent("project", "content/projects", (slug) => `/projects/${slug}`)
extractMdxContent("thread", "content/threads", (_slug, data) => data?.externalUrl || "/threads")
extractResumeChunks()

fs.mkdirSync(path.dirname(outPath), { recursive: true })
const output = {
  version: 1,
  createdAt: new Date().toISOString(),
  chunks,
}
fs.writeFileSync(outPath, JSON.stringify(output, null, 2))
console.log(`Wrote ${chunks.length} chunks to ${outPath}`)
