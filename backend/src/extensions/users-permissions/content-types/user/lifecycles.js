module.exports = {
  async afterCreate(event) {
    const { result, params } = event;
    
    const roleType = params.data.roleType;
    
    if (roleType) {
      try {
        const role = await strapi
          .query("plugin::users-permissions.role")
          .findOne({ where: { type: roleType } });

        if (role) {
          await strapi
            .query("plugin::users-permissions.user")
            .update({
              where: { id: result.id },
              data: { role: role.id },
            });
        }
      } catch (err) {
        console.error("Lifecycle role error:", err);
      }
    }
  },
};