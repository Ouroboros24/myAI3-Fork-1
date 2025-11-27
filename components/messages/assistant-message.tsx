import { UIMessage, ToolCallPart, ToolResultPart } from "ai";
import { Response } from "@/components/ai-elements/response";
import { ReasoningPart } from "./reasoning-part";
import { ToolCall, ToolResult } from "./tool-call";

export function AssistantMessage({ message, status, isLastMessage, durations, onDurationChange }: { message: UIMessage; status?: string; isLastMessage?: boolean; durations?: Record<string, number>; onDurationChange?: (key: string, duration: number) => void }) {
    return (
        <div className="w-full">
            <div className="rounded-3xl border border-white/5 bg-gradient-to-r from-secondary/80 via-secondary/40 to-transparent px-5 py-5 text-sm text-foreground shadow-[0_0_35px_rgba(15,23,42,0.65)] backdrop-blur-2xl">
                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-primary">
                    <span className="h-px flex-1 bg-primary/30" aria-hidden="true" />
                    AI RESPONSE
                    <span className="h-px flex-1 bg-primary/30" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-4 leading-relaxed">
                    {message.parts.map((part, i) => {
                        const isStreaming = status === "streaming" && isLastMessage && i === message.parts.length - 1;
                        const durationKey = `${message.id}-${i}`;
                        const duration = durations?.[durationKey];

                        if (part.type === "text") {
                            return <Response key={`${message.id}-${i}`}>{part.text}</Response>;
                        } else if (part.type === "reasoning") {
                            return (
                                <ReasoningPart
                                    key={`${message.id}-${i}`}
                                    part={part}
                                    isStreaming={isStreaming}
                                    duration={duration}
                                    onDurationChange={onDurationChange ? (d) => onDurationChange(durationKey, d) : undefined}
                                />
                            );
                        } else if (
                            part.type.startsWith("tool-") || part.type === "dynamic-tool"
                        ) {
                            if ('state' in part && part.state === "output-available") {
                                return (
                                    <ToolResult
                                        key={`${message.id}-${i}`}
                                        part={part as unknown as ToolResultPart}
                                    />
                                );
                            } else {
                                return (
                                    <ToolCall
                                        key={`${message.id}-${i}`}
                                        part={part as unknown as ToolCallPart}
                                    />
                                );
                            }
                        }
                        return null;
                    })}
                </div>
            </div>
        </div>
    )
}