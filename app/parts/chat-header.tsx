import { cn } from "@/lib/utils";

export function ChatHeaderBlock({ children, className }: { children?: React.ReactNode, className?: string }) {
    return (
        <div className={cn("gap-2 flex flex-1", className)}>
            {children}
        </div>
    )
}

export function ChatHeader({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex w-full flex-wrap items-center gap-4 rounded-3xl border border-white/5 bg-gradient-to-r from-white/5 via-white/0 to-white/5 px-6 py-5 text-sm text-muted-foreground shadow-[0_0_45px_rgba(15,23,42,0.6)] backdrop-blur-2xl">
            {children}
        </div>
    )
}