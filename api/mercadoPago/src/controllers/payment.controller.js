import mercadopago from "mercadopago";


export const createOrder = async (req, res) => {
  const { cartList } = req.body;

  try {
    mercadopago.configure({
      client_id: "TEST-1522152661",
      client_secret: "TEST-6854888482659911",
      access_token:
        "TEST-1503163077703643-112015-b8521d307a18cb53fba085bd7425f08d-1523637178",
    });
  
    const result = await mercadopago.preferences.create({
      // reason: product.name, con esta propiedad modificas el ticket para ponerle los nombres del producto.
      items: cartList.map((product) => ({
        title: product.name,
        currency_id: "ARS",
        unit_price: product.price,
        quantity: 1,
      })),
      back_urls: {
        success: `https://chiniapp-api-production.up.railway.app/success`,
        failure: `https://chiniapp-api-production.up.railway.app/failure`,
        pending: `https://chiniapp-api-production.up.railway.app/pending`,
      },
      redirect_urls: {
        failure: "/feilure",
        pending: "/pending",
        success: `https://chiniapp-api-production.up.railway.app/success`,
      },
      notification_url: "https://fcb6-190-194-144-75.ngrok-free.app/webhook",
      auto_return: "approved",
    });

    res.send(result.body);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
};

export const recieveWebhook = async (req, res) => {
  const payment = req.body;
  console.log(payment);

  try {
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(req.query["data.id"]);
      console.log("Payment Data:", data);
    }

    res.status(200).send("webhook");
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.sendStatus(500).json({ error: error.message });
  }
};
