import mercadopago from "mercadopago";

export const createOrder = async (req, res) => {
  const { cartList } = req.body;

  try {
    mercadopago.configure({
      client_id: "1418850663386812",
      client_secret: "91ogiySmYydTwhyIJhnLvrjf0bgziBnk",
      access_token:
        "APP_USR-1418850663386812-112014-e79ec7ac67d75fb39e6c57e5d7795955-174088517",
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
