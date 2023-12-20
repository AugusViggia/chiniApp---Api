import mercadopago from "mercadopago";
import { HOST } from "../../config.js";
import { sendEmail } from "../../../nodemailer/src/controllers/nodemailer.controllers.js";
import dotenv from "dotenv";
dotenv.config();

export const createOrder = async (req, res) => {
  // console.log("Body de la solicitud: ", req.body);
  const { cartList, totalPrice } = req.body;
  // const products = cartList;
  // const totalPay = totalPrice;
  // const return_Url = "https://chiniapp-front-production.up.railway.app/";
  // console.log("este el totalPrice: ", totalPrice);

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
        success: `https://chiniapp-api-production.up.railway.app//success`,
        failure: `https://chiniapp-api-production.up.railway.app//failure`,
        pending: `https://chiniapp-api-production.up.railway.app//pending`,
      },
      redirect_urls: {
        failure: "/feilure",
        pending: "/pending",
        success: `https://chiniapp-api-production.up.railway.app//success`,
      },
      notification_url: "https://fcb6-190-194-144-75.ngrok-free.app/webhook",
      auto_return: "approved",
    });

    // const paymentAprove = result.body.auto_return;
    // const clientEmail = result.body.payer.email;

    // if (paymentAprove === "approved") {
    //   await sendEmail({ products, totalPay, clientEmail });
    //   console.log("Se mando el email");
    // }
    
    console.log("Soy el resultado de mercadopago.create: ", result);
    // console.log("Soy el clientEmail: ", result.body.payer.email);
    // console.log("Soy el auto_return: ", result.body.auto_return);
    // console.log("init_point:", result.body.init_point);
    // res.redirect(return_Url);
    res.send(result.body);
    console.log("Me estoy yendo de createOrder");
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  }
};

export const recieveWebhook = async (req, res) => {
  const payment = req.body;
  console.log(payment);

  try {
    // console.log("Webhook Received:", payment);

    if (payment.type === "payment") {
      const data = await mercadopago.payment.findById(req.query["data.id"]);
      // console.log("Payment Data:", data);
    }

    res.status(200).send("webhook");
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.sendStatus(500).json({ error: error.message });
  }
};
