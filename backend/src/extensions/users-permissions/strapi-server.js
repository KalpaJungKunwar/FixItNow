module.exports = (plugin) => {
  const originalRegister = plugin.controllers.auth.register;

  plugin.controllers.auth.register = async (ctx) => {
    const { roleType, ...rest } = ctx.request.body;
    ctx.request.body = rest;

    await originalRegister(ctx);

    if (ctx.response.status === 200 && roleType) {
      try {
        const userId = ctx.response.body?.user?.id;

        const role = await strapi
          .query("plugin::users-permissions.role")
          .findOne({ where: { type: roleType } });

        if (role && userId) {
          await strapi
            .query("plugin::users-permissions.user")
            .update({
              where: { id: userId },
              data: { role: role.id },
            });
        }
      } catch (err) {
        console.error("Role assignment error:", err);
      }
    }
  };

  return plugin;
};