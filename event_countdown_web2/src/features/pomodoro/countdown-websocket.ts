"use client";

import { fetchAuthSession } from "aws-amplify/auth";
import { AMPLIFY_ENV_DEFAULTS } from "@/src/app/amplify-env-defaults";

export type WsEvent = {
  type: string;
  action: string;
  data: Record<string, unknown>;
};

function parseWsEvent(raw: string): WsEvent | null {
  try {
    const json = JSON.parse(raw) as Record<string, unknown>;
    return {
      type: typeof json.type === "string" ? json.type : "",
      action: typeof json.action === "string" ? json.action : "",
      data:
        json.data && typeof json.data === "object" && json.data !== null
          ? (json.data as Record<string, unknown>)
          : {},
    };
  } catch {
    return null;
  }
}

function websocketBaseUrl(): string {
  const raw = process.env.NEXT_PUBLIC_WEBSOCKET_URL?.trim();
  const s = raw && raw.length > 0 ? raw : AMPLIFY_ENV_DEFAULTS.websocketUrl;
  return s.replace(/\/$/, "");
}

/**
 * Same contract as Flutter `WebSocketService`: `wss://...?token=<idToken>`,
 * broadcast parsed events, reconnect with linear backoff (1–30s).
 */
export class CountdownWebSocket {
  private socket: WebSocket | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private disposed = false;
  private attempt = 0;
  private readonly listeners = new Set<(e: WsEvent) => void>();

  subscribe(fn: (e: WsEvent) => void): () => void {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  private emit(e: WsEvent) {
    for (const fn of this.listeners) fn(e);
  }

  async connect(): Promise<void> {
    if (this.disposed || this.socket?.readyState === WebSocket.OPEN) return;

    const session = await fetchAuthSession();
    const token = session.tokens?.idToken?.toString();
    if (!token) return;

    const base = websocketBaseUrl();
    const url = `${base}?token=${encodeURIComponent(token)}`;

    try {
      this.socket = new WebSocket(url);
      this.socket.onopen = () => {
        this.attempt = 0;
      };
      this.socket.onmessage = (ev) => {
        if (typeof ev.data !== "string") return;
        const parsed = parseWsEvent(ev.data);
        if (parsed) this.emit(parsed);
      };
      this.socket.onerror = () => {
        this.cleanupSocket();
        this.scheduleReconnect();
      };
      this.socket.onclose = () => {
        this.cleanupSocket();
        this.scheduleReconnect();
      };
    } catch {
      this.cleanupSocket();
      this.scheduleReconnect();
    }
  }

  private cleanupSocket() {
    if (this.socket) {
      try {
        this.socket.close();
      } catch {
        /* ignore */
      }
    }
    this.socket = null;
  }

  private scheduleReconnect() {
    if (this.disposed) return;
    this.attempt += 1;
    const sec = Math.min(30, Math.max(1, this.attempt));
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      void this.connect();
    }, sec * 1000);
  }

  dispose() {
    this.disposed = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.cleanupSocket();
    this.listeners.clear();
  }
}
