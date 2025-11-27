"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { ArrowUp, Loader2, Plus, Square } from "lucide-react";
import { MessageWall } from "@/components/messages/message-wall";
import { ChatHeader } from "@/app/parts/chat-header";
import { ChatHeaderBlock } from "@/app/parts/chat-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UIMessage } from "ai";
import { useEffect, useState, useRef } from "react";
import { AI_NAME, CLEAR_CHAT_TEXT, OWNER_NAME, WELCOME_MESSAGE } from "@/config";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  message: z
    .string()
    .min(1, "Message cannot be empty.")
    .max(2000, "Message must be at most 2000 characters."),
});

const STORAGE_KEY = 'chat-messages';

type StorageData = {
  messages: UIMessage[];
  durations: Record<string, number>;
};

const loadMessagesFromStorage = (): { messages: UIMessage[]; durations: Record<string, number> } => {
  if (typeof window === 'undefined') return { messages: [], durations: {} };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { messages: [], durations: {} };

    const parsed = JSON.parse(stored);
    return {
      messages: parsed.messages || [],
      durations: parsed.durations || {},
    };
  } catch (error) {
    console.error('Failed to load messages from localStorage:', error);
    return { messages: [], durations: {} };
  }
};

const saveMessagesToStorage = (messages: UIMessage[], durations: Record<string, number>) => {
  if (typeof window === 'undefined') return;
  try {
    const data: StorageData = { messages, durations };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save messages to localStorage:', error);
  }
};

export default function Chat() {
  const [isClient, setIsClient] = useState(false);
  const [durations, setDurations] = useState<Record<string, number>>({});
  const welcomeMessageShownRef = useRef<boolean>(false);

  const stored = typeof window !== 'undefined' ? loadMessagesFromStorage() : { messages: [], durations: {} };
  const [initialMessages] = useState<UIMessage[]>(stored.messages);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    messages: initialMessages,
  });

  useEffect(() => {
    setIsClient(true);
    setDurations(stored.durations);
    setMessages(stored.messages);
  }, []);

  useEffect(() => {
    if (isClient) {
      saveMessagesToStorage(messages, durations);
    }
  }, [durations, messages, isClient]);

  const handleDurationChange = (key: string, duration: number) => {
    setDurations((prevDurations) => {
      const newDurations = { ...prevDurations };
      newDurations[key] = duration;
      return newDurations;
    });
  };

  useEffect(() => {
    if (isClient && initialMessages.length === 0 && !welcomeMessageShownRef.current) {
      const welcomeMessage: UIMessage = {
        id: `welcome-${Date.now()}`,
        role: "assistant",
        parts: [
          {
            type: "text",
            text: WELCOME_MESSAGE,
          },
        ],
      };
      setMessages([welcomeMessage]);
      saveMessagesToStorage([welcomeMessage], {});
      welcomeMessageShownRef.current = true;
    }
  }, [isClient, initialMessages.length, setMessages]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    sendMessage({ text: data.message });
    form.reset();
  }

  function clearChat() {
    const newMessages: UIMessage[] = [];
    const newDurations = {};
    setMessages(newMessages);
    setDurations(newDurations);
    saveMessagesToStorage(newMessages, newDurations);
    toast.success("Chat cleared");
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground font-sans">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 left-10 h-[320px] w-[320px] rounded-full bg-cyan-400/25 blur-[160px]" />
        <div className="absolute top-1/3 right-10 h-[240px] w-[240px] rounded-full bg-fuchsia-500/20 blur-[140px]" />
        <div className="absolute bottom-[-120px] left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-indigo-600/20 blur-[220px]" />
      </div>
      <main className="relative flex h-screen w-full flex-col neon-grid">
        <div className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-gradient-to-b from-[#05010d]/90 via-[#05010d]/60 to-transparent backdrop-blur-xl">
          <div className="relative mx-auto w-full max-w-6xl px-5">
            <ChatHeader>
              <ChatHeaderBlock />
              <ChatHeaderBlock className="items-center justify-center gap-3">
                <Avatar className="size-10 border border-primary/40 bg-secondary/40 shadow-[0_0_35px_rgba(126,249,255,0.35)]">
                  <AvatarImage src="/logo.png" />
                  <AvatarFallback>
                    <Image src="/logo.png" alt="Logo" width={36} height={36} />
                  </AvatarFallback>
                </Avatar>
                <div className="text-sm uppercase tracking-[0.2em] text-primary">
                  Engage {AI_NAME}
                </div>
              </ChatHeaderBlock>
              <ChatHeaderBlock className="justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer rounded-full border-primary/40 bg-white/5 text-primary hover:bg-primary/10 hover:text-primary shadow-[0_0_20px_rgba(126,249,255,0.35)]"
                  onClick={clearChat}
                >
                  <Plus className="size-4" />
                  {CLEAR_CHAT_TEXT}
                </Button>
              </ChatHeaderBlock>
            </ChatHeader>
          </div>
        </div>

        <div className="gamer-scrollbar h-screen w-full overflow-y-auto px-5 pt-[120px] pb-[220px]">
          <div className="mx-auto flex min-h-full max-w-3xl flex-col items-center justify-end space-y-6">
            {isClient ? (
              <>
                <MessageWall
                  messages={messages}
                  status={status}
                  durations={durations}
                  onDurationChange={handleDurationChange}
                />
                {status === "submitted" && (
                  <div className="flex w-full max-w-3xl justify-start">
                    <Loader2 className="size-5 animate-spin text-primary" />
                  </div>
                )}
              </>
            ) : (
              <div className="flex w-full max-w-2xl justify-center">
                <Loader2 className="size-5 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-gradient-to-t from-[#05010d]/95 via-[#05010d]/75 to-transparent backdrop-blur-2xl">
          <div className="relative mx-auto flex w-full max-w-4xl items-center justify-center px-5 pt-6 pb-2">
            <div className="message-fade-overlay" />
            <div className="relative w-full rounded-[28px] border border-white/5 bg-white/5 p-0.5 shadow-[0_0_40px_rgba(124,58,237,0.35)] backdrop-blur-2xl">
              <div className="relative w-full rounded-[26px] border border-white/10 bg-[#05040f]/80 px-1 py-1">
                <form id="chat-form" onSubmit={form.handleSubmit(onSubmit)}>
                  <FieldGroup>
                    <Controller
                      name="message"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel htmlFor="chat-form-message" className="sr-only">
                            Message
                          </FieldLabel>
                          <div className="relative h-13">
                            <Input
                              {...field}
                              id="chat-form-message"
                              className="h-15 w-full rounded-[22px] border border-white/10 bg-transparent px-5 pr-16 text-base text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                              placeholder="Transmit your command..."
                              disabled={status === "streaming"}
                              aria-invalid={fieldState.invalid}
                              autoComplete="off"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                  e.preventDefault();
                                  form.handleSubmit(onSubmit)();
                                }
                              }}
                            />
                            {(status == "ready" || status == "error") && (
                              <Button
                                className="absolute right-2 top-2 size-11 rounded-full bg-primary text-primary-foreground shadow-[0_0_30px_rgba(126,249,255,0.55)] transition hover:shadow-[0_0_25px_rgba(126,249,255,0.8)]"
                                type="submit"
                                disabled={!field.value.trim()}
                                size="icon"
                              >
                                <ArrowUp className="size-4" />
                              </Button>
                            )}
                            {(status == "streaming" || status == "submitted") && (
                              <Button
                                className="absolute right-2 top-2 size-11 rounded-full border border-white/20 bg-white/5 text-white"
                                size="icon"
                                onClick={() => {
                                  stop();
                                }}
                              >
                                <Square className="size-4" />
                              </Button>
                            )}
                          </div>
                        </Field>
                      )}
                    />
                  </FieldGroup>
                </form>
              </div>
            </div>
          </div>
          <div className="w-full px-5 pb-4 text-center text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            © {new Date().getFullYear()} {OWNER_NAME}&nbsp;
            <Link href="/terms" className="text-primary underline underline-offset-4">Terms</Link>&nbsp;•&nbsp;Powered by&nbsp;
            <Link href="https://ringel.ai/" className="text-primary underline underline-offset-4">Ringel.AI</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
