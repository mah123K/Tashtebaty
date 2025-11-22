// api/pay.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { amount, orderId, serviceTitle, technicianName } = req.body;

    const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
    const INTEGRATION_ID = "5110357";
    const IFRAME_ID = "927005";

    if (!PAYMOB_API_KEY || !INTEGRATION_ID || !IFRAME_ID) {
      console.error("❌ Missing Paymob env vars");
      return res.status(500).json({ error: "Server config error" });
    }

    // 1️⃣ Auth
    const auth = await axios.post(
      "https://accept.paymob.com/api/auth/tokens",
      { api_key: PAYMOB_API_KEY }
    );
    const token = auth.data.token;

    // 2️⃣ Register order
    const order = await axios.post(
      "https://accept.paymob.com/api/ecommerce/orders",
      {
        auth_token: token,
        delivery_needed: false,
        amount_cents: Math.round(amount * 100),
        currency: "EGP",
        merchant_order_id: `${orderId}_${Date.now()}`,
        items: [],
      }
    );

    // 3️⃣ Generate payment key
    const paymentKey = await axios.post(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      {
        auth_token: token,
        amount_cents: Math.round(amount * 100),
        expiration: 3600,
        order_id: order.data.id,
        billing_data: {
          apartment: "NA",
          email: "client@tashtebaty.com",
          floor: "NA",
          first_name: "Client",
          street: "Cairo",
          building: "NA",
          phone_number: "+201000000000",
          shipping_method: "NA",
          city: "Cairo",
          country: "EG",
          last_name: "User",
          state: "NA",
        },
        currency: "EGP",
        integration_id: INTEGRATION_ID,
      }
    );

    const iframeUrl = `https://accept.paymob.com/api/acceptance/iframes/${IFRAME_ID}?payment_token=${paymentKey.data.token}`;


    return res.status(200).json({
      url: iframeUrl,
      orderSummary: { serviceTitle, technicianName, amount },
    });
  } catch (error) {
    console.error("❌ Paymob error:", error.response?.data || error.message);
    return res.status(500).json({ error: "Payment failed" });
  }
}
