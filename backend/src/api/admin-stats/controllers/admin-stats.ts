import { Context } from "koa";

export default {
  async getStats(ctx: Context) {
    const user = (ctx.state as any).user;
    if (!user || user.roleType !== "admin") {
      return ctx.forbidden("Admins only");
    }

    const [
      totalUsers,
      totalCustomers,
      totalProviders,
      totalAdmins,
      totalServiceRequests,
      totalBids,
      totalMessages,
      totalReviews,
      totalProviderProfiles,
    ] = await Promise.all([
      strapi.db.query("plugin::users-permissions.user").count({}),
      strapi.db
        .query("plugin::users-permissions.user")
        .count({ where: { roleType: "customer" } }),
      strapi.db
        .query("plugin::users-permissions.user")
        .count({ where: { roleType: "provider" } }),
      strapi.db
        .query("plugin::users-permissions.user")
        .count({ where: { roleType: "admin" } }),
      strapi.db.query("api::service-request.service-request").count({}),
      strapi.db.query("api::bid.bid").count({}),
      strapi.db.query("api::message.message").count({}),
      strapi.db.query("api::review.review").count({}),
      strapi.db.query("api::provider-profile.provider-profile").count({}),
    ]);

    const [pendingBids, acceptedBids, rejectedBids] = await Promise.all([
      strapi.db
        .query("api::bid.bid")
        .count({ where: { bid_status: "pending" } }),
      strapi.db
        .query("api::bid.bid")
        .count({ where: { bid_status: "accepted" } }),
      strapi.db
        .query("api::bid.bid")
        .count({ where: { bid_status: "rejected" } }),
    ]);

    const [
      openRequests,
      inProgressRequests,
      completedRequests,
      cancelledRequests,
    ] = await Promise.all([
      strapi.db
        .query("api::service-request.service-request")
        .count({ where: { service_status: "open" } }),
      strapi.db
        .query("api::service-request.service-request")
        .count({ where: { service_status: "in_progress" } }),
      strapi.db
        .query("api::service-request.service-request")
        .count({ where: { service_status: "completed" } }),
      strapi.db
        .query("api::service-request.service-request")
        .count({ where: { service_status: "cancelled" } }),
    ]);

    const providerProfiles = await strapi.db
      .query("api::provider-profile.provider-profile")
      .findMany({
        select: ["rating", "avg_hourly_rate", "specialty"] as any,
      });

    const avgRating = providerProfiles.length
      ? (
          providerProfiles.reduce(
            (s: number, p: any) => s + (p.rating || 0),
            0,
          ) / providerProfiles.length
        ).toFixed(2)
      : "0";

    const avgHourlyRate = providerProfiles.length
      ? (
          providerProfiles.reduce(
            (s: number, p: any) => s + (p.avg_hourly_rate || 0),
            0,
          ) / providerProfiles.length
        ).toFixed(2)
      : "0";

    const specialtyBreakdown = providerProfiles.reduce(
      (acc: Record<string, number>, p: any) => {
        if (p.specialty) acc[p.specialty] = (acc[p.specialty] || 0) + 1;
        return acc;
      },
      {},
    );

    const allReviews = await strapi.db.query("api::review.review").findMany({
      select: ["rating"] as any,
    });

    const avgReviewRating = allReviews.length
      ? (
          allReviews.reduce((s: number, r: any) => s + (r.rating || 0), 0) /
          allReviews.length
        ).toFixed(2)
      : "0";

    const recentUsers = await strapi.db
      .query("plugin::users-permissions.user")
      .findMany({
        orderBy: { createdAt: "desc" },
        limit: 5,
        select: [
          "id",
          "username",
          "email",
          "roleType",
          "confirmed",
          "blocked",
          "createdAt",
        ] as any,
      });

    const recentServiceRequests = await strapi.db
      .query("api::service-request.service-request")
      .findMany({
        orderBy: { createdAt: "desc" },
        limit: 5,
        select: [
          "id",
          "title",
          "category",
          "service_status",
          "suggested_budget",
          "location",
          "createdAt",
        ] as any,
        populate: { customer: { select: ["id", "username", "email"] } } as any,
      });

    const recentBids = await strapi.db.query("api::bid.bid").findMany({
      orderBy: { createdAt: "desc" },
      limit: 5,
      select: [
        "id",
        "amount",
        "bid_status",
        "availability",
        "createdAt",
      ] as any,
      populate: {
        provider: { select: ["id", "username", "email"] },
        service_request: { select: ["id", "title"] },
      } as any,
    });

    const recentReviews = await strapi.db.query("api::review.review").findMany({
      orderBy: { createdAt: "desc" },
      limit: 5,
      select: ["id", "rating", "comment", "createdAt"] as any,
      populate: {
        customer: { select: ["id", "username"] },
        provider_profile: { select: ["id", "specialty"] },
      } as any,
    });

    const [allSubscriptions, allServicePayments] = await Promise.all([
      strapi.db
        .query("api::provider-subscription.provider-subscription")
        .findMany({
          orderBy: { createdAt: "desc" },
          populate: {
            provider: { select: ["id", "username", "email"] },
          } as any,
        }),
      strapi.db.query("api::payment.payment").findMany({
        orderBy: { createdAt: "desc" },
        populate: {
          user: { select: ["id", "username", "email"] },
          service_request: { select: ["id", "title"] },
        } as any,
      }),
    ]);

    const activeSubscriptions = (allSubscriptions as any[]).filter(
      (s) =>
        s.subscriptionStatus === "active" &&
        new Date(s.expires_at) >= new Date(),
    );

    const subscriptionRevenue = activeSubscriptions.reduce(
      (sum: number, s: any) => sum + (s.amount || 0),
      0,
    );

    ctx.send({
      users: {
        total: totalUsers,
        customers: totalCustomers,
        providers: totalProviders,
        admins: totalAdmins,
      },
      serviceRequests: {
        total: totalServiceRequests,
        open: openRequests,
        inProgress: inProgressRequests,
        completed: completedRequests,
        cancelled: cancelledRequests,
      },
      bids: {
        total: totalBids,
        pending: pendingBids,
        accepted: acceptedBids,
        rejected: rejectedBids,
      },
      messages: { total: totalMessages },
      reviews: { total: totalReviews, avgRating: avgReviewRating },
      providers: {
        total: totalProviderProfiles,
        avgRating,
        avgHourlyRate,
        specialtyBreakdown,
      },
      recent: {
        users: recentUsers,
        serviceRequests: recentServiceRequests,
        bids: recentBids,
        reviews: recentReviews,
      },
      payments: {
        subscriptions: {
          total: allSubscriptions.length,
          active: activeSubscriptions.length,
          revenue: subscriptionRevenue,
        },
        recentSubscriptions: (allSubscriptions as any[]).slice(0, 10),
        servicePayments: (allServicePayments as any[]).slice(0, 10),
      },
    });
  },
};
