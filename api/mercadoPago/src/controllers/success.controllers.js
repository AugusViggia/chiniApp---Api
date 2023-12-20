import mercadopago from "mercadopago";
import { sendEmail } from "../../../nodemailer/src/controllers/nodemailer.controllers.js";
import dotenv from "dotenv";
dotenv.config();

export const successEvent = async (req, res) => {
    console.log("Controlador successEvent ejecutándose...");
    const return_Url = "http://localhost:3001/";
    // const return_Url = process.env.APP_HOME_URL;
    // const return_Url = "https://chiniapp-front-production.up.railway.app/success";
    // console.log(return_Url);
    console.log("Soy req.query: ", req.query);
    console.log("soy res: ", res.status);

    const { collection_status } = req.query;
    console.log("Soy collection status: ", collection_status);

    try {
        if (req.query && req.query.status === "approved") {
            const fetchPaymentDetails = async (paymentId) => {
                try {
                    const payment = await mercadopago.payment.findById(paymentId);
                    console.log("Soy el payment: ", payment);

                    return payment;
                } catch (error) {
                    console.error("Error al obtener detalles de pago:", error.message);
                    throw error;
                }
            };

            const paymentDetails = await fetchPaymentDetails(req.query.payment_id);
            const products = paymentDetails.body.additional_info.items;
            const totalPay = paymentDetails.body.transaction_amount;
            const clientEmail = paymentDetails.body.payer.email;

            // console.log("soy los paymentDetails: ", paymentDetails);
            // console.log("soy el email del cliente: ", clientEmail);
            // console.log("soy los items: ", products);
            // console.log("soy el total: ", totalPay);

            await sendEmail({ products, totalPay, clientEmail });
        }

        // console.log("a ese link nos redirigimos: ", return_Url);

        // res.redirect(return_Url);
        res.redirect(return_Url);
        return;
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
