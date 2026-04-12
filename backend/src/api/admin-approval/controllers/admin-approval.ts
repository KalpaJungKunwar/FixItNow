import { Context } from "koa";

async function requireAdmin(ctx: Context): Promise<boolean> {
  const ctxUser = (ctx.state as any).user;
  if (!ctxUser) {
    ctx.unauthorized("You must be logged in");
    return false;
  }

  const fullUser = await strapi
    .query("plugin::users-permissions.user")
    .findOne({ where: { id: ctxUser.id }, select: ["id", "roleType"] });

  if (!fullUser || fullUser.roleType !== "admin") {
    ctx.forbidden("Admins only");
    return false;
  }

  return true;
}

async function safeFind(uid: string, options: object): Promise<any[]> {
  try {
    const result = await strapi.entityService.findMany(uid as any, options);
    return Array.isArray(result) ? result : [];
  } catch (e: any) {
    strapi.log.warn(`getUserDetail: skipping ${uid} — ${e.message}`);
    return [];
  }
}

export default {
  async getPendingUsers(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;

    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters: { approvalStatus: "pending" } as any,
        populate: {
          documentations: {
            populate: { file: true },
          },
        } as any,
        fields: [
          "id",
          "username",
          "email",
          "roleType",
          "approvalStatus",
        ] as any,
      },
    );
    ctx.body = users;
  },

  async getAllUsers(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;

    const users = await strapi.entityService.findMany(
      "plugin::users-permissions.user",
      {
        filters: { roleType: { $not: "admin" } } as any,
        populate: {
          documentations: {
            populate: { file: true },
          },
        } as any,
        fields: [
          "id",
          "username",
          "email",
          "roleType",
          "approvalStatus",
          "blocked",
          "confirmed",
          "createdAt",
        ] as any,
        sort: { createdAt: "desc" } as any,
      },
    );
    ctx.body = users;
  },

  async deleteUser(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;

    const { userId } = ctx.params;

    const docs = await safeFind("api::documentation.documentation", {
      filters: { user: { id: userId } },
    });
    for (const doc of docs) {
      await strapi.entityService.delete(
        "api::documentation.documentation",
        doc.id,
      );
    }

    const profiles = await safeFind("api::provider-profile.provider-profile", {
      filters: { user: { id: userId } },
    });
    for (const profile of profiles) {
      await strapi.entityService.delete(
        "api::provider-profile.provider-profile",
        profile.id,
      );
    }

    await strapi.entityService.delete("plugin::users-permissions.user", userId);

    ctx.body = { message: "User deleted successfully" };
  },

  async approveUser(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;

    const { userId } = ctx.params;

    await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      {
        data: {
          approvalStatus: "approved",
          confirmed: true,
          blocked: false,
        } as any,
      },
    );

    const docs = await safeFind("api::documentation.documentation", {
      filters: { user: { id: userId } },
    });
    for (const doc of docs) {
      await strapi.entityService.update(
        "api::documentation.documentation",
        doc.id,
        { data: { approvalStatus: "approved" } },
      );
    }

    ctx.body = { message: "User approved successfully" };
  },

  async rejectUser(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;

    const { userId } = ctx.params;
    const { reason } = ctx.request.body as any;

    await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      {
        data: {
          approvalStatus: "rejected",
          rejectionReason: reason,
          blocked: true,
        } as any,
      },
    );

    const docs = await safeFind("api::documentation.documentation", {
      filters: { user: { id: userId } },
    });
    for (const doc of docs) {
      await strapi.entityService.update(
        "api::documentation.documentation",
        doc.id,
        { data: { approvalStatus: "rejected" } },
      );
    }

    ctx.body = { message: "User rejected" };
  },

  async blockUser(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;
    const { userId } = ctx.params;
    await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      { data: { blocked: true } as any },
    );
    ctx.body = { message: "User blocked" };
  },

  async unblockUser(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;
    const { userId } = ctx.params;
    await strapi.entityService.update(
      "plugin::users-permissions.user",
      userId,
      { data: { blocked: false } as any },
    );
    ctx.body = { message: "User unblocked" };
  },

  async getUserDetail(ctx: Context) {
    if (!(await requireAdmin(ctx))) return;

    const { userId } = ctx.params;
    const id = Number(userId);

    if (!id || isNaN(id)) {
      return ctx.badRequest("Invalid userId");
    }

    let user: any = null;

    try {
      user = await strapi.entityService.findOne(
        "plugin::users-permissions.user",
        id,
        {
          populate: {
            documentations: { populate: { file: true } },
          } as any,
          fields: [
            "id",
            "username",
            "email",
            "roleType",
            "approvalStatus",
            "blocked",
            "confirmed",
            "createdAt",
          ] as any,
        },
      );
    } catch (e: any) {
      strapi.log.error(`getUserDetail: user findOne failed — ${e.message}`);
      return ctx.badRequest(`Failed to fetch user: ${e.message}`);
    }

    if (!user) return ctx.notFound("User not found");

    try {
      const raw = await strapi.query("plugin::users-permissions.user").findOne({
        where: { id },
        select: ["rejectionReason"] as any,
      });
      user.rejectionReason = raw?.rejectionReason ?? null;
    } catch (_) {
      user.rejectionReason = null;
    }

    const serviceRequests = await safeFind(
      "api::service-request.service-request",
      {
        filters: { customer: { id } },
        sort: { createdAt: "desc" },
        limit: 20,
      },
    );

    const bids = await safeFind("api::bid.bid", {
      filters: { provider: { id } },
      populate: { service_request: true },
      sort: { createdAt: "desc" },
      limit: 20,
    });

    const reviews = await safeFind("api::review.review", {
      filters: { customer: { id } },
      populate: { provider_profile: true },
      sort: { createdAt: "desc" },
      limit: 20,
    });

    const providerProfiles = await safeFind("api::provider-profile.provider-profile", {
      filters: { user: { id } },
    });
    const providerProfileId = providerProfiles?.[0]?.id ?? null;
    const reviewsReceived = providerProfileId
      ? await safeFind("api::review.review", {
          filters: { provider_profile: { id: providerProfileId } },
          populate: { customer: true },
          sort: { createdAt: "desc" },
          limit: 20,
        })
      : [];

    const messages = await safeFind("api::message.message", {
      filters: { sender: { id } },
      sort: { createdAt: "desc" },
      limit: 30,
    });

    ctx.body = { user, serviceRequests, bids, reviews, reviewsReceived, messages };
  },
};
