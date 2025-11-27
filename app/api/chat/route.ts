import {
  streamText,
  UIMessage,
  convertToModelMessages,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse,
} from "ai";
import { MODEL } from "@/config";
import { SYSTEM_PROMPT } from "@/prompts";
import { isContentFlagged } from "@/lib/moderation";
import { webSearch } from "./tools/web-search";
import { vectorDatabaseSearch } from "./tools/search-vector-database";

export const maxDuration = 30;

export async function POST(req: Request) {
  // parse request (messages + optional retrieval params)
  const payload = await req.json().catch(() => ({}));
  const { messages }: { messages?: UIMessage[] } = payload || {};

  // sanity
  if (!messages || !Array.isArray(messages)) {
    return new Response("Bad request: missing messages", { status: 400 });
  }

  // find latest user text for moderation + retrieval query
  const latestUserMessage = messages.filter((m) => m.role === "user").pop();
  let latestText = "";
  if (latestUserMessage && Array.isArray((latestUserMessage as any).parts)) {
    latestText = (latestUserMessage as any).parts
      .filter((p: any) => p.type === "text")
      .map((p: any) => ("text" in p ? p.text : ""))
      .join(" ");
  }

  // moderation check
  if (latestText) {
    const mod = await isContentFlagged(latestText);
    if (mod && mod.flagged) {
      const stream = createUIMessageStream({
        execute({ writer }) {
          const textId = "moderation-denial-text";
          writer.write({ type: "start" });
          writer.write({ type: "text-start", id: textId });
          writer.write({
            type: "text-delta",
            id: textId,
            delta: mod.denialMessage || "Your message violates our guidelines.",
          });
          writer.write({ type: "text-end", id: textId });
          writer.write({ type: "finish" });
        },
      });
      return createUIMessageStreamResponse({ stream });
    }
  }

  // --- Retrieval step: call vectorDatabaseSearch to get hits and assemble retrievalContext
  const retrievalQuery = (payload.retrieval_query || latestText || "").toString();
  const topK = Number(payload.top_k || 6);
  const experienceFilter = payload.experience_filter;
  let retrievalContext = "";

  if (retrievalQuery) {
    try {
      const filterObj: Record<string, any> | undefined = experienceFilter
        ? { experience_tags: { $in: [experienceFilter] } }
        : undefined;

      const hits = await vectorDatabaseSearch(retrievalQuery, topK, filterObj);

      if (Array.isArray(hits) && hits.length) {
        const lines: string[] = hits.map((h: any, idx: number) => {
          const m = h.meta || {};
          const title = m.title ?? m.name ?? `Game ${h.id}`;
          const desc = (m.description || m.why_recommended || m.summary || "")
            .toString()
            .replace(/\s+/g, " ")
            .trim();
          const warn = Array.isArray(m.content_warnings) 
            ? m.content_warnings.join(", ") 
            : (m.content_warnings || "");
          const url = m.rawg_url || m.url || "";
          return `Result ${idx + 1}: ${title}\nWhy: ${desc}\nWarnings: ${warn}\nURL: ${url}`;
        });
        retrievalContext = lines.join("\n\n");
      } else {
        retrievalContext = "";
      }
    } catch (err) {
      console.warn("retrieval error:", err);
      retrievalContext = "";
    }
  }

  // Attach retrievalContext for prompt assembly
  (globalThis as any).__REQ_BODY = { ...(payload || {}), retrievalContext };

  // Build and stream the model response
  const result = streamText({
    model: MODEL,
    system: SYSTEM_PROMPT,
    messages: convertToModelMessages(messages),
    tools: {
      webSearch,
    },
    stopWhen: stepCountIs(10),
    providerOptions: {
      openai: {
        reasoningSummary: "auto",
        reasoningEffort: "low",
        parallelToolCalls: false,
      },
    },
  });

  return result.toUIMessageStreamResponse({ sendReasoning: true });
}
