import { Server } from "socket.io";
import type { Core } from "@strapi/strapi";

process.on('unhandledRejection', (reason: any) => {
  if (reason?.code === 'EBUSY' && reason?.syscall === 'unlink') {
    console.warn('[upload] Ignored EBUSY temp file cleanup (Windows lock):', reason.path);
    return;
  }
  console.error('Unhandled Rejection:', reason);
  process.exit(1);
});

export default {
  register({ strapi }: { strapi: Core.Strapi }) {
    const usersPermissionsPlugin = strapi.plugin('users-permissions');
    const originalRegister = usersPermissionsPlugin.controller('auth').register;

    usersPermissionsPlugin.controller('auth').register = async function (ctx: any) {
      // Read roleType before anything strips it
      const roleType = ctx.request.body?.roleType || 'customer';

      // Remove roleType so Strapi's register doesn't fail on unknown field
      if (ctx.request.body) {
        delete ctx.request.body.roleType;
      }

      // Call Strapi's original register
      await originalRegister.call(this, ctx);

      // Only proceed if registration succeeded
      if (ctx.response.status === 200 && ctx.response.body?.user?.id) {
        const userId = ctx.response.body.user.id;
        const knex = (strapi as any).db.connection;

        try {
          // Find correct role
          const role = await strapi
            .query('plugin::users-permissions.role')
            .findOne({ where: { type: roleType } });

          // Raw DB update — bypasses all Strapi hooks and services
          await knex('up_users')
            .where({ id: userId })
            .update({
              blocked: true,
              confirmed: false,
              approval_status: 'pending',
              role_type: roleType,
              ...(role ? { role: role.id } : {}),
            });

          console.log(`[register] User ${userId} blocked=true, roleType=${roleType}`);
        } catch (err) {
          console.error('[register] Failed to update user after registration:', err);
        }

        // Nullify JWT so they can't use the token
        ctx.response.body.jwt = null;
      }
    };
  },

  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const io = new Server((strapi as any).server.httpServer, {
      cors: { origin: "http://localhost:5173", credentials: true },
    });

    (strapi as any).io = io;

    io.on("connection", (socket) => {
      socket.on("join_room", (requestId: string) => {
        socket.join(requestId);
      });

      socket.on("send_message", async (data) => {
        io.to(data.requestId).emit("receive_message", {
          ...data,
          timestamp: new Date().toISOString(),
        });

        await (strapi as any).entityService.create("api::message.message", {
          data: {
            msg: data.message,
            sender_name: data.senderName,
            service_request: data.requestId,
            sender: data.senderId,
          },
        });
      });

      socket.on("leave_room", (requestId: string) => {
        socket.leave(requestId);
      });

      socket.on("disconnect", () => {});
    });
  },
};