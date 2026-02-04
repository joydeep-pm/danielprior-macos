import fs from "fs"
import path from "path"

type KnowledgeChunk = {
  id: string
  text: string
  source: "website" | "resume"
  type: "hero" | "about" | "metric" | "skill" | "work" | "case-study" | "project" | "thread" | "contact" | "resume"
  title?: string
  company?: string
  role?: string
  dates?: string
  tags?: string[]
  url?: string
}

type KnowledgeBase = {
  version: number
  createdAt: string
  chunks: KnowledgeChunk[]
}

type EmbeddingVector = {
  id: string
  embedding: number[]
}

type EmbeddingStore = {
  model: string
  dimensions?: number
  vectors: EmbeddingVector[]
}

const knowledgePath = path.join(process.cwd(), "data", "rag", "knowledge.json")
const embeddingsPath = path.join(process.cwd(), "data", "rag", "embeddings.json")

let cachedKnowledge: KnowledgeBase | null = null
let cachedEmbeddings: EmbeddingStore | null = null

const STOPWORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "for",
  "to",
  "of",
  "in",
  "on",
  "with",
  "by",
  "is",
  "are",
  "was",
  "were",
  "be",
  "as",
  "at",
  "from",
  "that",
  "this",
  "it",
  "your",
  "you",
  "me",
  "my",
  "their",
  "they",
])

function readJsonFile<T>(filePath: string): T {
  const raw = fs.readFileSync(filePath, "utf8")
  return JSON.parse(raw) as T
}

function loadKnowledge(): KnowledgeBase {
  if (cachedKnowledge) return cachedKnowledge
  if (!fs.existsSync(knowledgePath)) {
    throw new Error("Knowledge base not found. Build data/rag/knowledge.json first.")
  }
  cachedKnowledge = readJsonFile<KnowledgeBase>(knowledgePath)
  return cachedKnowledge
}

function loadEmbeddings(): EmbeddingStore | null {
  if (cachedEmbeddings) return cachedEmbeddings
  if (!fs.existsSync(embeddingsPath)) return null
  cachedEmbeddings = readJsonFile<EmbeddingStore>(embeddingsPath)
  return cachedEmbeddings
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9₹$+\- ]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t))
}

function termOverlapScore(query: string, text: string): number {
  const queryTokens = new Set(tokenize(query))
  if (queryTokens.size === 0) return 0
  const textTokens = tokenize(text)
  let score = 0
  for (const token of textTokens) {
    if (queryTokens.has(token)) score += 1
  }
  return score / Math.max(1, queryTokens.size)
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0
  let normA = 0
  let normB = 0
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  if (!denom) return 0
  return dot / denom
}

function buildContext(chunks: KnowledgeChunk[]): string {
  return chunks
    .map((chunk, index) => {
      const meta = [
        chunk.title,
        chunk.company,
        chunk.role,
        chunk.dates,
        chunk.tags?.length ? `Tags: ${chunk.tags.join(", ")}` : undefined,
      ]
        .filter(Boolean)
        .join(" | ")

      return `Source ${index + 1}${meta ? ` (${meta})` : ""}:\n${chunk.text}`.trim()
    })
    .join("\n\n")
}

async function embedQuery(query: string, apiKey: string, model: string): Promise<number[]> {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input: query,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Embedding request failed: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as {
    data: { embedding: number[] }[]
  }

  return data.data[0]?.embedding ?? []
}

async function generateAnswer(prompt: string, context: string, apiKey: string, model: string): Promise<string> {
  const system = [
    "You are Joydeep Sarkar's portfolio assistant.",
    "Answer only using the provided context.",
    'If the answer is not in the context, reply: \"Not found in my profile information.\"',
    "Do not guess or fabricate.",
    "Keep responses concise and professional.",
  ].join(" ")

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.2,
      max_tokens: 350,
      messages: [
        { role: "system", content: system },
        {
          role: "user",
          content: `Question: ${prompt}\n\nContext:\n${context}`,
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Chat request failed: ${response.status} ${errorText}`)
  }

  const data = (await response.json()) as {
    choices: { message?: { content?: string } }[]
  }

  return data.choices?.[0]?.message?.content?.trim() || "Not found in my profile information."
}

export async function getRagAnswer(question: string) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return {
      answer: "RAG backend is not configured. Please set OPENAI_API_KEY on the server.",
      sources: [],
    }
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o-mini"
  const embedModel = process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
  const maxChunks = Number.parseInt(process.env.RAG_MAX_CHUNKS || "5", 10)

  const knowledge = loadKnowledge()
  if (!knowledge.chunks?.length) {
    return {
      answer: "Not found in my profile information.",
      sources: [],
    }
  }

  const embeddings = loadEmbeddings()
  let topChunks: KnowledgeChunk[] = []

  if (embeddings?.vectors?.length) {
    const queryEmbedding = await embedQuery(question, apiKey, embedModel)
    const chunkMap = new Map(knowledge.chunks.map((chunk) => [chunk.id, chunk]))

    topChunks = embeddings.vectors
      .map((vector) => {
        const chunk = chunkMap.get(vector.id)
        if (!chunk) return null
        return {
          chunk,
          score: cosineSimilarity(queryEmbedding, vector.embedding),
        }
      })
      .filter((item): item is { chunk: KnowledgeChunk; score: number } => Boolean(item))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxChunks)
      .map((item) => item.chunk)
  } else {
    topChunks = knowledge.chunks
      .map((chunk) => ({
        chunk,
        score: termOverlapScore(question, chunk.text),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, maxChunks)
      .map((item) => item.chunk)
  }

  if (!topChunks.length) {
    return {
      answer: "Not found in my profile information.",
      sources: [],
    }
  }

  const context = buildContext(topChunks)
  const answer = await generateAnswer(question, context, apiKey, model)

  return {
    answer,
    sources: topChunks.map((chunk) => ({
      id: chunk.id,
      title: chunk.title || chunk.company || chunk.role || "Source",
      type: chunk.type,
      url: chunk.url,
      source: chunk.source,
    })),
  }
}
