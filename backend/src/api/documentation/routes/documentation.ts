export default {
  routes: [
    {
      method: 'POST',
      path: '/documentations/pending-upload',
      handler: 'documentation.pendingUpload',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/documentations',
      handler: 'documentation.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/documentations/:id',
      handler: 'documentation.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/documentations',
      handler: 'documentation.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/documentations/:id',
      handler: 'documentation.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/documentations/:id',
      handler: 'documentation.delete',
      config: { auth: false },
    },
  ],
};