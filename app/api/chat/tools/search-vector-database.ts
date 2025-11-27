import { tool } from "ai";
import { z } from "zod";
import { pineconeIndex } from "@/lib/pinecone";
import { PINECONE_TOP_K } from '@/config';

// Plain function that returns array of results (what route.ts expects)
export async function vectorDatabaseSearch(
  query: string,
  topK: number = PINECONE_TOP_K || 6,
  filter?: Record<string, any>
): Promise<any[]> {
  try {
    const results = await pineconeIndex.namespace('default').searchRecords({
      query: {
        inputs: {
          text: query,
        },
        topK: topK,
      },
      fields: ['text', 'pre_context', 'post_context', 'source_url', 'source_description', 'source_type', 'order'],
    });

    // Convert Pinecone results to the format route.ts expects
    const hits = (results.records || []).map((record: any) => ({
      id: record.id,
      score: record.score || 0,
      meta: {
        title: record.metadata?.source_description || record.metadata?.title || "Unknown Game",
        description: record.metadata?.text || "",
        why_recommended: record.metadata?.text || "",
        summary: record.metadata?.text || "",
        content_warnings: record.metadata?.content_warnings || [],
        content_rating: record.metadata?.content_rating || "",
        experience_tags: record.metadata?.experience_tags || [],
        rawg_url: record.metadata?.source_url || "",
        url: record.metadata?.source_url || "",
      },
    }));

    // Apply experience filter if provided
    if (filter?.experience_tags?.$in && Array.isArray(hits)) {
      const allowedTags = filter.experience_tags.$in;
      return hits.filter((hit: any) => {
        const itemTags = hit.meta?.experience_tags || [];
        return allowedTags.some((tag: string) => itemTags.includes(tag));
      });
    }

    return hits;
  } catch (error) {
    console.error("Vector search error:", error);
    return [];
  }
}

// Tool export (optional, for future use)
export const vectorDatabaseSearchTool = tool({
  description: 'Search the vector database for game information',
  parameters: z.object({
    query: z.string().describe('The search query for finding relevant games'),
  }),
  execute: async ({ query }) => {
    const results = await vectorDatabaseSearch(query);
    return results;
  },
});
