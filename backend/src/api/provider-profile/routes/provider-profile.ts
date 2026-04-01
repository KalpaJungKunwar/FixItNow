export default {
  routes: [
    {
      method: 'POST',
      path: '/provider-profiles/public-create',
      handler: 'provider-profile.publicCreate',
      config: {
        auth: false,
      },
    },
    {
      method: 'GET',
      path: '/provider-profiles',
      handler: 'provider-profile.find',
      config: { auth: false },
    },
    {
      method: 'GET',
      path: '/provider-profiles/:id',
      handler: 'provider-profile.findOne',
      config: { auth: false },
    },
    {
      method: 'POST',
      path: '/provider-profiles',
      handler: 'provider-profile.create',
      config: { auth: false },
    },
    {
      method: 'PUT',
      path: '/provider-profiles/:id',
      handler: 'provider-profile.update',
      config: { auth: false },
    },
    {
      method: 'DELETE',
      path: '/provider-profiles/:id',
      handler: 'provider-profile.delete',
      config: { auth: false },
    },
  ],
};