import mercadopago from "mercadopago";
import { APP_HOME_URL } from "../../config.js";
import { sendEmail } from "../../../nodemailer/src/controllers/nodemailer.controllers.js";

export const successEvent = async (req, res) => {
    const return_Url = `${APP_HOME_URL}`;

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
            const clientEmail = paymentDetails.body.payer.email;

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