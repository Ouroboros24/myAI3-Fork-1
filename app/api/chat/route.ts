import {
    streamText,
    UIMessage,
    convertToModelMessages,
    stepCountIs,
    createUIMessageStream,
    createUIMessageStreamResponse
} from "ai";

import { MODEL } from "@/config";
import { SYSTEM_PROMPT } from "@/prompts";
import { isContentFlagged } from "@/lib/moderation";
import { webSearch } from "./tools/web-search";

// IMPORTANT: searchGames is your Pinecone RAG query function
import { searchGames } from "./tools/search-vector-database";

export const maxDuration = 30;

export async function POST(req: Request) {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Extract latest user text for moderation
    const latestUserMessage = messages
        .filter((msg) => msg.role === "user")
        .pop();

    if (latestUserMessage) {
        const textParts = latestUserMessage.parts
            .filter((p) => p.type === "text")
            .map((p) => ("text" in p ? p.text : ""))
            .join("");

        if (textParts) {
            const moderationResult = await isContentFlagged(textParts);

            if (moderationResult.flagged) {
                const stream = createUIMessageStream({
                    execute({ writer }) {
                        const textId = "moderation-denial-text";

                        writer.write({ type: "start" });
                        writer.write({ type: "text-start", id: textId });
                        writer.write({
                            type: "text-delta",
                            id: textId,
                            delta:
                                moderationResult.denialMessage ||
                                "Your message violates the guidelines.",
                        });
                        writer.write({ type: "text-end", id: textId });
                        writer.write({ type: "finish" });
                    },
                });

                return createUIMessageStreamResponse({ stream });
            }
        }
    }

    // Wrap searchGames as a tool for the model
    const vectorDatabaseSearch = async ({ query }: { query: string }) => {
        const results = await searchGames(query);
        return results;
    };

    // LLM call
    const result = streamText({
        model: MODEL,
        system: SYSTEM_PROMPT,
        messages: convertToModelMessages(messages),
        tools: {
            webSearch,
            vectorDatabaseSearch,
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

    return result.toUIMessageStreamResponse({
        sendReasoning: true,
    });
}
