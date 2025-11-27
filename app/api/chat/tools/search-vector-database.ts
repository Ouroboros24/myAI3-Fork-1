import { tool } from "ai";
import { z } from "zod";
import { searchPinecone } from "@/lib/pinecone";

// The actual search function (plain function, not a tool)
export async function vectorDatabaseSearch(
  query: string,
  topK: number = 6,
  filter?: Record<string, any>
): Promise<any[]> {
  try {
    // Call your Pinecone search with the parameters
    const results = await searchPinecone(query, topK, filter);
    return results;
  } catch (error) {
    console.error("Vector search error:", error);
    return [];
  }
}

// Export as a tool for AI SDK if needed (optional)
export const vectorDatabaseSearchTool = tool({
  description: 'Search the vector database for game information',
  parameters: z.object({
    query: z.string().describe('The search query for finding relevant games'),
    topK: z.number().optional().default(6).describe('Number of results to return'),
  }),
  execute: async ({ query, topK }) => {
    return await vectorDatabaseSearch(query, topK);
  },
});
