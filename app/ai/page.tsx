"use client";

import { useState } from "react";
import { Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
      },
    ]);

    setInput("");
  };

  return (
    <main className="min-h-screen bg-[#0B1120] p-8 text-white">
      <div className="mx-auto flex h-[85vh] max-w-5xl flex-col rounded-3xl border border-white/10 bg-[#111827]/70 backdrop-blur-xl">

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/10 p-6">
          <div className="rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 p-3">
            <Bot size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Zora AI Assistant
            </h1>

            <p className="text-sm text-gray-400">
              Ask anything.
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-gray-500">
              Start a conversation with Zora.
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`max-w-[75%] rounded-2xl p-4 ${
                  message.role === "user"
                    ? "ml-auto bg-blue-600"
                    : "bg-white/10"
                }`}
              >
                {message.content}
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="flex gap-3 border-t border-white/10 p-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Message Zora..."
            className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 outline-none"
          />

          <button
            onClick={sendMessage}
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-5 transition hover:scale-105"
          >
            <Send size={20} />
          </button>
        </div>

      </div>
    </main>
  );
}