import mercadopago from "mercadopago";
import { HOST } from "../../config.js";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
  // console.log("Body de la solicitud: ", req.body);
  const { cartList } = req.body;
  // console.log("este el totalPrice: ", totalPrice);

  try {
    mercadopago.configure({
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
        success: `${HOST}/success`,
        failure: `${HOST}/failure`,
        pending: `${HOST}/pending`,
      },
      notification_url: "https://be32-190-194-144-75.ngrok.io/webhook",
      auto_return: "approved",
    });
    
    console.log("soy el resultado de mercadopago.create: ", result);
    // console.log("init_point:", result.body.init_point);
    
    res.send(result.body);
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }

};

export const recieveWebhook = async (req, res) => {
  const payment = req.query;

  try {
    console.log("Webhook Received:", payment);

    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(req.query["data.id"]);
      console.log("Payment Data:", data);
    }

    res.sendStatus(204);
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.sendStatus(500).json({ error: error.message });
  }
};
