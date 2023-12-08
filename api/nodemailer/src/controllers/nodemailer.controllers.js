import { transporter } from "../nodemailerConfig.js";
import { generateHtml } from "../emailHtml.js";

export const sendEmail = async ({ products, totalPay, clientEmail }) => {
  try {
    const emailHtml = generateHtml({ products, totalPay });

    const email = {
      from: "chiniBakery00@gmail.com",
      to: [clientEmail, "augusto.viggiano@gmail.com"]
        .filter(Boolean)
        .join(", "),
      subject: "Confirmación de compra en ChiniBakery",
      html: emailHtml,
    };

    await transporter.sendMail(email);

    // console.log(email);
  } catch (error) {
    throw console.log(error);
  }
};
