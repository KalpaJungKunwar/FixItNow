import { factories } from "@strapi/strapi";
import axios from "axios";

export default factories.createCoreController(
  "api::payment.payment",
  ({ strapi }) => ({
    async initiate(ctx) {
      const { serviceRequestId, amount } = ctx.request.body;
      const user = ctx.state.user;

      try {
        const response = await axios.post(
          "https://dev.khalti.com/api/v2/epayment/initiate/",
          {
            return_url: `${process.env.BACKEND_URL}/api/payments/verify`,
            website_url: process.env.FRONTEND_URL,
            amount: amount * 100,
            purchase_order_id: `SR-${serviceRequestId}`,
            purchase_order_name: "FixItNow Service Payment",
            customer_info: {
              name: user.username,
              email: user.email,
            },
          },
          {
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            },
          },
        );

        await strapi.entityService.create("api::payment.payment", {
          data: {
            pidx: response.data.pidx,
            amount: amount,
            paymentStatus: "pending",
            service_request: serviceRequestId,
            user: user.id,
            publishedAt: new Date().toISOString(),
          },
        });

        ctx.body = {
          payment_url: response.data.payment_url,
          pidx: response.data.pidx,
        };
      } catch (error) {
        console.error(
          "Khalti initiate error:",
          error?.response?.data || error.message,
        );
        ctx.status = 400;
        ctx.body = { error: error?.response?.data || error.message };
      }
    },

    async verify(ctx) {
      const { pidx } = ctx.query;

      console.log("=== VERIFY CALLED ===");
      console.log("pidx from query:", pidx);

      try {
        const response = await axios.post(
          "https://dev.khalti.com/api/v2/epayment/lookup/",
          { pidx },
          {
            headers: {
              Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
            },
          },
        );

        console.log("Khalti lookup response:", JSON.stringify(response.data));

        const payments = await strapi.entityService.findMany(
          "api::payment.payment",
          {
            filters: { pidx },
            populate: ["service_request"],
          },
        );

        console.log("Payments found:", JSON.stringify(payments));

        const payment = payments[0] as any;

        if (!payment) {
          console.error("No payment record found for pidx:", pidx);
          return ctx.redirect(
            `${process.env.FRONTEND_URL}/payment/failed?reason=not_found`,
          );
        }

        const khaltiStatus = response.data.status;
        console.log("Khalti status:", khaltiStatus);

        if (khaltiStatus === "Completed") {
          await strapi.entityService.update(
            "api::payment.payment",
            payment.id,
            {
              data: {
                paymentStatus: "completed",
                transaction_id: response.data.transaction_id,
                publishedAt: new Date().toISOString(),
              },
            },
          );

          if (payment.service_request?.id) {
            await strapi.entityService.update(
              "api::service-request.service-request",
              payment.service_request.id,
              { data: { service_status: "completed" } },
            );
          }

          return ctx.redirect(
            `${process.env.FRONTEND_URL}/payment/success?pidx=${pidx}&transaction_id=${response.data.transaction_id}`,
          );
        } else {
          await strapi.entityService.update(
            "api::payment.payment",
            payment.id,
            {
              data: { paymentStatus: "failed" },
            },
          );

          return ctx.redirect(
            `${process.env.FRONTEND_URL}/payment/failed?reason=${khaltiStatus}`,
          );
        }
      } catch (error) {
        console.error("Verify error:", error?.response?.data || error.message);
        return ctx.redirect(
          `${process.env.FRONTEND_URL}/payment/failed?reason=server_error`,
        );
      }
    },
  }),
);
