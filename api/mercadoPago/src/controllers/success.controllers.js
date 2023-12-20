import mercadopago from "mercadopago";
import { sendEmail } from "../../../nodemailer/src/controllers/nodemailer.controllers.js";
import dotenv from "dotenv";
dotenv.config();

export const successEvent = async (req, res) => {
    const return_Url = "https://chiniapp-front-production.up.railway.app/";

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

            await sendEmail({ products, totalPay, clientEmail });
        }

        res.redirect(return_Url);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
};
