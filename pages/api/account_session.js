const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method === "POST") {
    let accountId;

    // step 1 - create account
    try {
      const response = await stripe.accounts.create({
        type: "custom",
        capabilities: {
          transfers: {
            requested: true,
          },
          card_payments: {
            requested: true,
          },
        },
        business_type: "individual",
      });

      accountId = response.id;
    } catch (error) {
      res.status(500);
      res.send({ error: error.message });
    }

    try {
      const accountSession = await stripe.accountSessions.create({
        account: accountId,
        components: {
          payments: {
            enabled: true,
            features: {
              refund_management: true,
              dispute_management: true,
              capture_payments: true,
            },
          },
        },
      });

      res.json({
        client_secret: accountSession.client_secret,
      });
    } catch (error) {
      console.error(
        "An error occurred when calling the Stripe API to create an account session",
        error
      );
      res.status(500);
      res.send({ error: error.message });
    }
  }
}
