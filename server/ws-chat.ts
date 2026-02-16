import type http from "http";
import { WebSocketServer, type WebSocket } from "ws";

type ClientState = {
  channelId: string;
};

type JoinMessage = {
  type: "join";
  channelId: string;
};

type ChatMessage = {
  type: "message";
  channelId: string;
  senderName: string;
  text: string;
  createdAt?: number;
};

type IncomingMessage = JoinMessage | ChatMessage;

type OutgoingMessage =
  | {
      type: "connected";
      channels: string[];
      serverTime: number;
    }
  | {
      type: "message";
      channelId: string;
      senderName: string;
      text: string;
      createdAt: number;
    }
  | {
      type: "error";
      message: string;
    };

const WS_SINGLETON_KEY = "__spiriterax_ws_chat__" as const;

export function attachChatWebSocketServer(httpServer: http.Server) {
  const g = globalThis as unknown as Record<string, unknown>;
  const existing = g[WS_SINGLETON_KEY] as WebSocketServer | undefined;
  if (existing) return existing;

  const wss = new WebSocketServer({ noServer: true });
  const clients = new Map<WebSocket, ClientState>();

  const upgradeListener = (req: http.IncomingMessage, socket: any, head: Buffer) => {
    const url = req.url ?? "";
    const isChatPath = url === "/ws/chat" || url.startsWith("/ws/chat?") || url.startsWith("/ws/chat/");
    if (!isChatPath) return;

    console.log("[ws-chat] upgrade", url);
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit("connection", ws, req);
    });
  };

  httpServer.on("upgrade", upgradeListener);

  const send = (ws: WebSocket, payload: OutgoingMessage) => {
    if (ws.readyState !== ws.OPEN) return;
    ws.send(JSON.stringify(payload));
  };

  const broadcastToChannel = (channelId: string, payload: OutgoingMessage) => {
    for (const [ws, state] of clients) {
      if (state.channelId !== channelId) continue;
      send(ws, payload);
    }
  };

  wss.on("connection", (ws) => {
    console.log("[ws-chat] connected");
    clients.set(ws, { channelId: "general" });

    send(ws, {
      type: "connected",
      channels: ["general", "prayer", "tech", "announcements"],
      serverTime: Date.now(),
    });

    ws.on("message", (raw) => {
      const text = typeof raw === "string" ? raw : raw.toString("utf8");

      let msg: IncomingMessage;
      try {
        msg = JSON.parse(text) as IncomingMessage;
      } catch {
        send(ws, { type: "error", message: "Invalid JSON" });
        return;
      }

      if (msg.type === "join") {
        if (!msg.channelId || typeof msg.channelId !== "string") {
          send(ws, { type: "error", message: "Invalid channelId" });
          return;
        }
        clients.set(ws, { channelId: msg.channelId });
        return;
      }

      if (msg.type === "message") {
        if (!msg.channelId || typeof msg.channelId !== "string") {
          send(ws, { type: "error", message: "Invalid channelId" });
          return;
        }
        if (!msg.text || typeof msg.text !== "string") {
          send(ws, { type: "error", message: "Invalid message" });
          return;
        }

        const createdAt = typeof msg.createdAt === "number" ? msg.createdAt : Date.now();
        const senderName = msg.senderName && typeof msg.senderName === "string" ? msg.senderName : "User";

        broadcastToChannel(msg.channelId, {
          type: "message",
          channelId: msg.channelId,
          senderName,
          text: msg.text,
          createdAt,
        });
        return;
      }

      send(ws, { type: "error", message: "Unknown message type" });
    });

    ws.on("close", () => {
      console.log("[ws-chat] disconnected");
      clients.delete(ws);
    });

    ws.on("error", () => {
      clients.delete(ws);
    });
  });

  g[WS_SINGLETON_KEY] = wss;
  return wss;
}
