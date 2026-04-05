import { factories } from '@strapi/strapi';
import axios from 'axios';

export default factories.createCoreController('api::provider-subscription.provider-subscription', ({ strapi }) => ({

  async initiate(ctx) {
    const user = ctx.state.user;
    const { plan = 'monthly' } = ctx.request.body;
    const amount = plan === 'yearly' ? 2000 : 299; // Rs. 299/month or Rs. 2000/year

    try {
      const response = await axios.post(
        'https://dev.khalti.com/api/v2/epayment/initiate/',
        {
          return_url: `${process.env.BACKEND_URL}/api/subscriptions/verify`,
          website_url: process.env.FRONTEND_URL,
          amount: amount * 100,
          purchase_order_id: `SUB-${user.id}-${Date.now()}`,
          purchase_order_name: `FixItNow ${plan} Subscription`,
          customer_info: { name: user.username, email: user.email },
        },
        { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` } }
      );

      const now = new Date();
      const expiresAt = new Date(now);
      plan === 'yearly'
        ? expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        : expiresAt.setMonth(expiresAt.getMonth() + 1);

      await strapi.entityService.create('api::provider-subscription.provider-subscription', {
        data: {
          pidx: response.data.pidx,
          amount,
          plan,
          subscriptionStatus: 'pending',
          provider: user.id,
          starts_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          publishedAt: new Date().toISOString(),
        },
      });

      ctx.body = { payment_url: response.data.payment_url, pidx: response.data.pidx };
    } catch (error) {
      ctx.status = 400;
      ctx.body = { error: error?.response?.data || error.message };
    }
  },

  async verify(ctx) {
    const { pidx } = ctx.query;
    try {
      const response = await axios.post(
        'https://dev.khalti.com/api/v2/epayment/lookup/',
        { pidx },
        { headers: { Authorization: `Key ${process.env.KHALTI_SECRET_KEY}` } }
      );

      const subs = await strapi.entityService.findMany(
        'api::provider-subscription.provider-subscription',
        { filters: { pidx }, populate: ['provider'] }
      );
      const sub = (subs as any[])[0];
      if (!sub) return ctx.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=not_found`);

      if (response.data.status === 'Completed') {
        await strapi.entityService.update('api::provider-subscription.provider-subscription', sub.id, {
          data: { subscriptionStatus: 'active', transaction_id: response.data.transaction_id },
        });
        return ctx.redirect(`${process.env.FRONTEND_URL}/payment/success?type=subscription&pidx=${pidx}`);
      } else {
        await strapi.entityService.update('api::provider-subscription.provider-subscription', sub.id, {
          data: { subscriptionStatus: 'failed' },
        });
        return ctx.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=${response.data.status}`);
      }
    } catch (error) {
      return ctx.redirect(`${process.env.FRONTEND_URL}/payment/failed?reason=server_error`);
    }
  },

  async status(ctx) {
    const user = ctx.state.user;
    const now = new Date().toISOString();
    const subs = await strapi.entityService.findMany(
      'api::provider-subscription.provider-subscription',
      {
        filters: {
          provider: { id: user.id },
          subscriptionStatus: 'active',
          expires_at: { $gte: now },
        } as any,
        sort: { expires_at: 'desc' },
        limit: 1,
      }
    );
    const active = (subs as any[])[0] ?? null;
    ctx.body = {
      isActive: !!active,
      subscription: active
        ? { plan: active.plan, expires_at: active.expires_at, amount: active.amount }
        : null,
    };
  },
}));