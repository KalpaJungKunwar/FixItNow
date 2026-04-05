export default {
  routes: [
    {
      method: 'POST',
      path: '/subscriptions/initiate',
      handler: 'provider-subscription.initiate',
      config: { policies: [], auth: { scope: ['api::provider-subscription.provider-subscription.initiate'] } },
    },
    {
      method: 'GET',
      path: '/subscriptions/verify',
      handler: 'provider-subscription.verify',
      config: { policies: [], auth: false },
    },
    {
      method: 'GET',
      path: '/subscriptions/status',
      handler: 'provider-subscription.status',
      config: { policies: [] },
    },
  ],
};