import mercadopago from "mercadopago";
import { HOST } from "../../config.js";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
  const cartList = req.body;
  console.log(cartList);

  mercadopago.configure({
    access_token: process.env.ACCESS_TOKEN || "",
  });

  const result = await mercadopago.preferences.create({
    items: cartList.map((product) => ({
      title: product.title,
      currency_id: "ARS",
      unit_price: product.price,
      quantity: 1,
    })),
    back_urls: {
      success: `${HOST}/success`,
      failure: `${HOST}/failure`,
      pending: `${HOST}/pending`,
    },
    notification_url: "https://d373-190-194-144-75.ngrok.io/webhook",
    auto_return: "approved",
  });

  console.log(result);
  console.log("init_point:", result.body.init_point);

  res.send(result.body);
};

export const recieveWebhook = async (req, res) => {
  const payment = req.query;

  try {
    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(req.query["data.id"]);
      console.log(data);
    }

    res.sendStatus(204);
  } catch (error) {
    return res.sendStatus(500).json({ error: error.message });
  }
};
