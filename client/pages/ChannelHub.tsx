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

type WsConnectedMessage = {
  type: "connected";
  channels: string[];
  serverTime: number;
};

type WsChatMessage = {
  type: "message";
  channelId: string;
  senderName: string;
  text: string;
  createdAt: number;
};

type WsErrorMessage = {
  type: "error";
  message: string;
};

type WsIncoming = WsConnectedMessage | WsChatMessage | WsErrorMessage;

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
  const [wsStatus, setWsStatus] = useState<"connecting" | "open" | "closed">("connecting");
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

  const wsRef = useRef<WebSocket | null>(null);
  const activeChannelIdRef = useRef(activeChannelId);

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

  useEffect(() => {
    const proto = window.location.protocol === "https:" ? "wss" : "ws";
    const wsUrl = `${proto}://${window.location.host}/ws/chat`;

    setWsStatus("connecting");
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.addEventListener("open", () => {
      setWsStatus("open");
      ws.send(JSON.stringify({ type: "join", channelId: activeChannelIdRef.current }));
    });

    ws.addEventListener("message", (event) => {
      let data: WsIncoming;
      try {
        data = JSON.parse(String(event.data)) as WsIncoming;
      } catch {
        return;
      }

      if (data.type === "message") {
        setMessages((prev) => [
          ...prev,
          {
            id: `ws_${data.createdAt}_${Math.random().toString(16).slice(2)}`,
            channelId: data.channelId,
            senderName: data.senderName,
            text: data.text,
            createdAt: data.createdAt,
          },
        ]);
      }
    });

    ws.addEventListener("close", () => {
      setWsStatus("closed");
    });

    ws.addEventListener("error", () => {
      setWsStatus("closed");
    });

    return () => {
      try {
        ws.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    };
  }, []);

  useEffect(() => {
    activeChannelIdRef.current = activeChannelId;
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ type: "join", channelId: activeChannelId }));
  }, [activeChannelId]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;

    const senderName = currentUser?.fullName || currentUser?.username || "User";

    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(
        JSON.stringify({
          type: "message",
          channelId: activeChannelId,
          senderName,
          text,
          createdAt: Date.now(),
        })
      );
    } else {
      // Fallback (should be rare): local echo
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
    }
    setDraft("");
  };

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 md:p-8 max-w-7xl">
        <h1 className="text-3xl font-bold text-foreground mb-4">Channel Hub</h1>
        <p className="text-muted-foreground mb-6">
          Explore our community channels and connect with others.
        </p>
        
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <p className="text-muted-foreground">
            This page is coming soon. Continue prompting Fusion to build out the content for this hub!
          </p>
        </div>
      </div>
    </div>
  );
}
