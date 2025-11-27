import { UIMessage } from "ai";
import { Response } from "@/components/ai-elements/response";

export function UserMessage({ message }: { message: UIMessage }) {
    return (
        <div className="whitespace-pre-wrap w-full flex justify-end">
            <div className="max-w-lg w-fit rounded-3xl border border-white/10 bg-gradient-to-r from-white/10 via-white/5 to-primary/20 px-5 py-4 text-white shadow-[0_0_35px_rgba(126,249,255,0.25)] backdrop-blur-xl">
                <div className="text-sm leading-relaxed tracking-wide">
                    {message.parts.map((part, i) => {
                        switch (part.type) {
                            case "text":
                                return <Response key={`${message.id}-${i}`}>{part.text}</Response>;
                        }
                    })}
                </div>
            </div>
        </div>
    )
}