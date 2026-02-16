import { useEffect, useMemo, useRef, useState } from "react";
import { Send } from "lucide-react";
import { AuthManager } from "@/lib/auth";

type ChatMessage = {
  id: string;
  channelId: string;
  senderName: string;
  text: string;
  createdAt: number;
};

const channels = [
  { id: "general", name: "General" },
  { id: "prayer", name: "Prayer" },
  { id: "tech", name: "Faith x Tech" },
  { id: "announcements", name: "Announcements" },
];

export default function ChannelHub() {
  const currentUser = AuthManager.getCurrentUser();
  const [activeChannelId, setActiveChannelId] = useState(channels[0]?.id ?? "general");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const now = Date.now();
    return [
      {
        id: "m1",
        channelId: "general",
        senderName: "SpiritEraX",
        text: "Welcome to Channel Hub. Start a conversation.",
        createdAt: now - 1000 * 60 * 30,
      },
      {
        id: "m2",
        channelId: "prayer",
        senderName: "SpiritEraX",
        text: "Share your prayer requests here.",
        createdAt: now - 1000 * 60 * 25,
      },
    ];
  });

  const activeChannel = useMemo(
    () => channels.find((c) => c.id === activeChannelId) ?? channels[0],
    [activeChannelId]
  );

  const channelMessages = useMemo(
    () => messages.filter((m) => m.channelId === activeChannelId).sort((a, b) => a.createdAt - b.createdAt),
    [messages, activeChannelId]
  );

  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [activeChannelId, channelMessages.length]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;

    const senderName = currentUser?.fullName || currentUser?.username || "User";

    setMessages((prev) => [
      ...prev,
      {
        id: `m_${Date.now()}_${Math.random().toString(16).slice(2)}`,
        channelId: activeChannelId,
        senderName,
        text,
        createdAt: Date.now(),
      },
    ]);
    setDraft("");
  };

  return (
    <div className="flex-1 w-full min-h-0">
      <div className="p-6 md:p-8 md:px-12 lg:px-20 w-full min-h-0">
        <h1 className="text-3xl font-bold text-foreground mb-2">Channel Hub</h1>
        <p className="text-muted-foreground mb-6">
          Explore our community channels and connect with others.
        </p>

        <div className="bg-card rounded-lg border border-border w-full min-h-[70vh] md:min-h-[72vh] flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-72 border-b md:border-b-0 md:border-r border-border bg-card">
            <div className="p-4">
              <p className="text-sm font-semibold text-foreground">Channels</p>
              <p className="text-xs text-muted-foreground mt-1">Tap a channel to chat</p>
            </div>

            <div className="px-2 pb-3 md:pb-4 overflow-auto md:h-full">
              {channels.map((c) => {
                const isActive = c.id === activeChannelId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveChannelId(c.id)}
                    className={
                      "w-full text-left px-3 py-2 rounded-md transition-colors " +
                      (isActive
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground")
                    }
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">#{c.name}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex-1 min-w-0 flex flex-col min-h-0">
            <div className="px-4 py-3 border-b border-border flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-semibold text-foreground truncate">#{activeChannel?.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {currentUser ? `Signed in as ${currentUser.fullName || currentUser.username}` : "You are browsing"}
                </p>
              </div>
            </div>

            <div ref={listRef} className="flex-1 min-h-0 overflow-auto px-4 py-4 space-y-3 bg-background/40 pb-24 md:pb-4">
              {channelMessages.length === 0 ? (
                <div className="text-sm text-muted-foreground">No messages yet. Say hello.</div>
              ) : (
                channelMessages.map((m) => {
                  const isMe = (currentUser?.fullName || currentUser?.username || "") === m.senderName;
                  return (
                    <div key={m.id} className={"flex " + (isMe ? "justify-end" : "justify-start")}>
                      <div
                        className={
                          "max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 border " +
                          (isMe
                            ? "bg-primary text-primary-foreground border-primary/40"
                            : "bg-card text-foreground border-border")
                        }
                      >
                        <div className={"text-xs mb-1 " + (isMe ? "text-primary-foreground/80" : "text-muted-foreground")}>
                          {m.senderName}
                        </div>
                        <div className="text-sm whitespace-pre-wrap break-words">{m.text}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-border bg-card p-3 md:p-4 sticky bottom-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  rows={1}
                  placeholder={currentUser ? "Write a message…" : "Log in to chat…"}
                  disabled={!currentUser}
                  className="flex-1 resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={!currentUser || !draft.trim()}
                  className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground px-3 py-2 text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:hover:bg-primary"
                  aria-label="Send"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-2">
                Press Enter to send. Shift+Enter for a new line.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
