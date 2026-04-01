import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::documentation.documentation', ({ strapi }) => ({
  async pendingUpload(ctx) {
    const { userId, documentType } = ctx.request.body;

    if (!userId || !documentType) {
      return ctx.badRequest('Missing userId or documentType');
    }

    const user = await strapi
      .query('plugin::users-permissions.user')
      .findOne({ where: { id: Number(userId) }, select: ['id', 'approvalStatus'] });

    if (!user || user.approvalStatus !== 'pending') {
      return ctx.forbidden('Invalid or already processed user');
    }

    const { files } = ctx.request as any;
    if (!files?.files) {
      return ctx.badRequest('No file uploaded');
    }

    const uploadedFiles = await strapi
      .plugin('upload')
      .service('upload')
      .upload({
        data: {},
        files: files.files,
      });

    const fileId = uploadedFiles[0].id;

    const doc = await strapi.entityService.create('api::documentation.documentation', {
      data: {
        documentType,
        file: fileId,
        approvalStatus: 'pending',
        user: Number(userId),
      },
    });

    ctx.body = doc;
  },
}));