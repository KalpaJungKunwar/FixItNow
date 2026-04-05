export default {
  routes: [
    {
      method: 'POST',
      path: '/payments/initiate',
      handler: 'payment.initiate',
      config: {
        policies: [],
        auth: {
          scope: ['api::payment.payment.initiate'],
        },
      },
    },
    {
      method: 'GET',
      path: '/payments/verify',
      handler: 'payment.verify',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};