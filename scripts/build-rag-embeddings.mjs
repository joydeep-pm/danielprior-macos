#!/usr/bin/env node
import fs from "fs"
import path from "path"

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

const inputPath = path.resolve(options.in || "data/rag/knowledge.json")
const outputPath = path.resolve(options.out || "data/rag/embeddings.json")
const model = options.model || "text-embedding-3-small"
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.error("OPENAI_API_KEY is required to build embeddings.")
  process.exit(1)
}

if (!fs.existsSync(inputPath)) {
  console.error(`Knowledge file not found: ${inputPath}`)
  process.exit(1)
}

const knowledge = JSON.parse(fs.readFileSync(inputPath, "utf8"))
const chunks = knowledge.chunks || []

const vectors = []

for (let i = 0; i < chunks.length; i += 1) {
  const chunk = chunks[i]
  const input = chunk.text.slice(0, 4000)
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      input,
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Embedding request failed: ${response.status} ${errorText}`)
  }

  const data = await response.json()
  const embedding = data?.data?.[0]?.embedding
  if (!embedding) {
    throw new Error("Missing embedding response.")
  }

  vectors.push({ id: chunk.id, embedding })

  if ((i + 1) % 10 === 0 || i + 1 === chunks.length) {
    console.log(`Embedded ${i + 1}/${chunks.length}`)
  }
}

const output = {
  model,
  dimensions: vectors[0]?.embedding?.length || null,
  vectors,
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, JSON.stringify(output, null, 2))
console.log(`Wrote embeddings to ${outputPath}`)
