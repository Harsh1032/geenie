// src/types/global.d.ts
import type { Server as SocketIOServer } from "socket.io";

declare global {
  var io: SocketIOServer | undefined;
}
