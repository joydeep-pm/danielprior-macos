# RAG Data

This folder stores the portfolio knowledge base and embeddings used by the RAG assistant.

## Build knowledge

```bash
node scripts/build-rag-knowledge.mjs \
  --website ~/Projects/joy-portfolio \
  --resume ~/Downloads/Joydeep_Sarkar_Resume.pdf \
  --out data/rag/knowledge.json
```

## Build embeddings

```bash
OPENAI_API_KEY=your_key \
node scripts/build-rag-embeddings.mjs \
  --in data/rag/knowledge.json \
  --out data/rag/embeddings.json
```

If `embeddings.json` is missing or empty, the API falls back to keyword matching.
