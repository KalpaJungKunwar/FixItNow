import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::provider-profile.provider-profile",
  ({ strapi }) => ({
    async publicCreate(ctx) {
      const { userId, specialty, experience, location, avg_hourly_rate } =
        ctx.request.body;

      if (!userId) {
        return ctx.badRequest("Missing userId");
      }

      const user = await strapi
        .query("plugin::users-permissions.user")
        .findOne({
          where: { id: Number(userId) },
          select: ["id", "approvalStatus"],
        });

      if (!user || user.approvalStatus !== "pending") {
        return ctx.forbidden("Invalid or already processed user");
      }

      const profile = await strapi.entityService.create(
        "api::provider-profile.provider-profile",
        {
          data: {
            specialty,
            experience: Number(experience),
            location,
            avg_hourly_rate: Number(avg_hourly_rate),
            user: Number(userId),
            publishedAt: new Date(), // ← ADD THIS to auto-publish
          },
        },
      );

      ctx.body = profile;
    },
  }),
);
