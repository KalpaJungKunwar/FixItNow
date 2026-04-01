// src/extensions/users-permissions/strapi-server.js
module.exports = (plugin) => {
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx) => {
    await originalCallback(ctx);

    if (ctx.response.status === 200 && ctx.response.body?.user) {
      try {
        const userId = ctx.response.body.user.id;
        const user = await strapi
          .query('plugin::users-permissions.user')
          .findOne({ where: { id: userId }, select: ['approvalStatus'] });

        if (user?.approvalStatus === 'pending') {
          ctx.response.status = 403;
          ctx.response.body = {
            error: { status: 403, name: 'ForbiddenError', message: 'Your account is pending admin approval.' },
          };
        } else if (user?.approvalStatus === 'rejected') {
          ctx.response.status = 403;
          ctx.response.body = {
            error: { status: 403, name: 'ForbiddenError', message: 'Your account has been rejected. Please contact support.' },
          };
        }
      } catch (err) {
        console.error('Login block error:', err);
      }
    }
  };

  return plugin;
};