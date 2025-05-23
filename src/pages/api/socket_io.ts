// src/pages/api/socket_io.ts
import { Server as NetServer } from "http";
import { Server as SocketIOServer } from "socket.io";
import type { NextApiRequest, NextApiResponse } from "next";
import type { NextApiResponseWithSocket } from "@/lib/socket";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseWithSocket
) {
  if (!res.socket.server.io) {
    console.log("🔌 Starting Socket.IO server...");
    const io = new SocketIOServer(res.socket.server, {
      path: "/api/socket_io",
    });

    res.socket.server.io = io;
    globalThis.io = io;
  }

  res.end();
}
