import mercadopago from "mercadopago";
import { HOST } from "../../config.js";
import { sendEmail } from "../../../nodemailer/src/controllers/nodemailer.controllers.js";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
  console.log("Body de la solicitud: ", req.body);
  const { cartList } = req.body;
  // console.log("este el totalPrice: ", totalPrice);

mercadopago.configure({
  access_token: process.env.ACCESS_TOKEN,
});

  const result = await mercadopago.preferences.create({
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
    notification_url: "https://d373-190-194-144-75.ngrok.io/webhook",
    auto_return: "approved",
  });
  
  // console.log(result);
  // console.log("init_point:", result.body.init_point);
  
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

export const successEvent = async (req, res) => {
  const return_Url = process.env.APP_HOME_URL;

  try {
    if (req.query && req.query.status === "approved") {
      
      const fetchPaymentDetails = async (paymentId) => {
        try {
          const payment = await mercadopago.payment.findById(paymentId);
          return payment;
        } catch (error) {
          console.error("Error al obtener detalles de pago:", error.message);
          throw error;
        }
      };

      const paymentDetails = await fetchPaymentDetails(req.query.payment_id);
      const products = paymentDetails.body.additional_info.items;
      const totalPay = paymentDetails.body.transaction_amount;
      const clientEmail = paymentDetails.body.payer.email


      console.log("soy los paymentDetails: ", paymentDetails);
      // console.log("soy el email del cliente: ", clientEmail);
      // console.log("soy los items: ", products);
      // console.log("soy el total: ", totalPay);

      await sendEmail({ products, totalPay, clientEmail });
    }
    // res.json(req.body);

    res.redirect(return_Url);
    return;
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};
