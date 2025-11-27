/**
 * app/api/chat/tools/search-vector-database.ts
 * BGE embed -> Pinecone REST query (no SDK). Uses env vars:
 *   BGE_EMBED_URL, PINECONE_INDEX_HOST, PINECONE_INDEX_NAME, PINECONE_API_KEY
 */

type PineconeMatch = { id: string; score: number; metadata?: any };

async function embedTextBGE(text: string) {
  const url = process.env.BGE_EMBED_URL;
  if (!url) throw new Error("Missing BGE_EMBED_URL env var");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input: text })
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Embed service failed: ${res.status} ${t}`);
  }
  const j = await res.json();
  const emb = j.embedding ?? (j.data && j.data[0] && j.data[0].embedding);
  if (!Array.isArray(emb)) throw new Error("Could not extract embedding from embed response");
  return emb as number[];
}

async function queryPinecone(vector: number[], topK = 8, filter?: Record<string, any>) {
  const host = process.env.PINECONE_INDEX_HOST;
  const index = process.env.PINECONE_INDEX_NAME || "my-ai";
  const apiKey = process.env.PINECONE_API_KEY;
  if (!host || !apiKey) throw new Error("Missing Pinecone env vars");

  const url = `${host}/databases/${index}/query`;
  const body: any = {
    vector,
    topK,
    includeMetadata: true,
    includeValues: false
  };
  if (filter) body.filter = filter;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": apiKey
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Pinecone query failed: ${res.status} ${txt}`);
  }
  const j = await res.json();
  const matches: PineconeMatch[] = (j.matches || []).map((m: any) => ({
    id: m.id,
    score: m.score,
    metadata: m.metadata
  }));
  return matches;
}

export async function searchGames(query: string, topK = 6, filter?: Record<string, any>) {
  const vector = await embedTextBGE(query);
  const results = await queryPinecone(vector, topK, filter);
  return results.map(r => ({ id: r.id, score: r.score, meta: r.metadata }));
}
