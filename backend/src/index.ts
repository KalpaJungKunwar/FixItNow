import { Server } from "socket.io";
import type { Core } from "@strapi/strapi";

export default {
  register() {},

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const io = new Server((strapi as any).server.httpServer, {
      cors: { origin: "http://localhost:5173", credentials: true },
    });

    (strapi as any).io = io;

    io.on("connection", (socket) => {
      socket.on("join_room", (requestId: string) => {
        socket.join(requestId);
      });

      // ← replace the old send_message with this
      socket.on("send_message", async (data) => {
        // Broadcast immediately (don't wait for DB)
        io.to(data.requestId).emit("receive_message", {
          ...data,
          timestamp: new Date().toISOString(),
        });

        // Persist to DB in background
        await (strapi as any).entityService.create("api::message.message", {
          data: {
            msg: data.message, // field is called "msg" in your schema
            sender_name: data.senderName,
            service_request: data.requestId,
            sender: data.senderId,
          },
        });
      });

      // ADD THIS
      socket.on("leave_room", (requestId: string) => {
        socket.leave(requestId);
      });

      socket.on("disconnect", () => {});
    });
  },
};
