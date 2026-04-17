import fs from 'fs';
import { Server } from "socket.io";
import type { Core } from "@strapi/strapi";

// Patch fs.unlink, fs.rmdir, and fs.rm to handle Windows file-locking on temp upload cleanup
const _unlink = fs.unlink.bind(fs);
(fs as any).unlink = (filePath: string, cb: (err: NodeJS.ErrnoException | null) => void) => {
  _unlink(filePath, (err) => {
    if (err && (err.code === 'EPERM' || err.code === 'EBUSY' || err.code === 'ENOTEMPTY')) {
      setTimeout(() => _unlink(filePath, () => {}), 800);
      cb(null);
    } else {
      cb(err);
    }
  });
};

const _rmdir = fs.rmdir.bind(fs);
(fs as any).rmdir = (dirPath: string, optionsOrCb: any, maybeCb?: any) => {
  const cb = maybeCb ?? optionsOrCb;
  const opts = maybeCb ? optionsOrCb : undefined;
  const wrapped = (err: NodeJS.ErrnoException | null) => {
    if (err && (err.code === 'ENOTEMPTY' || err.code === 'EBUSY' || err.code === 'EPERM')) {
      setTimeout(() => (opts ? _rmdir(dirPath, opts, () => {}) : _rmdir(dirPath, () => {})), 1000);
      cb(null);
    } else {
      cb(err);
    }
  };
  opts ? _rmdir(dirPath, opts, wrapped) : _rmdir(dirPath, wrapped);
};

const _rm = fs.rm?.bind(fs);
if (_rm) {
  (fs as any).rm = (dirPath: string, optionsOrCb: any, maybeCb?: any) => {
    const cb = maybeCb ?? optionsOrCb;
    const opts = maybeCb ? optionsOrCb : undefined;
    const wrapped = (err: NodeJS.ErrnoException | null) => {
      if (err && (err.code === 'ENOTEMPTY' || err.code === 'EBUSY' || err.code === 'EPERM')) {
        setTimeout(() => (opts ? _rm(dirPath, opts, () => {}) : _rm(dirPath, () => {})), 1000);
        cb(null);
      } else {
        cb(err);
      }
    };
    opts ? _rm(dirPath, opts, wrapped) : _rm(dirPath, wrapped);
  };
}

// rest of your existing code unchanged...

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
    const originalCallback = usersPermissionsPlugin.controller('auth').callback;

    usersPermissionsPlugin.controller('auth').callback = async function (ctx: any) {
      try {
        await originalCallback.call(this, ctx);
      } catch (err: any) {
        ctx.status = 400;
        ctx.body = {
          error: {
            status: 400,
            name: 'ValidationError',
            message: err.message || 'Invalid Username or password.',
          },
        };
      }
    };

    usersPermissionsPlugin.controller('auth').register = async function (ctx: any) {
      const roleType = ctx.request.body?.roleType || 'customer';

      if (ctx.request.body) {
        delete ctx.request.body.roleType;
      }

      try {
        await originalRegister.call(this, ctx);
      } catch (err: any) {
        ctx.status = 400;
        ctx.body = {
          error: {
            status: 400,
            name: 'ValidationError',
            message: err.message || 'Registration failed.',
          },
        };
        return;
      }

      if (ctx.status === 200 && ctx.body?.user?.id) {
        const userId = ctx.body.user.id;
        const knex = (strapi as any).db.connection;

        try {
          const role = await strapi
            .query('plugin::users-permissions.role')
            .findOne({ where: { type: roleType } });

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

        ctx.body.jwt = null;
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