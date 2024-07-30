import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "augustoempresaprueba@gmail.com",
    pass: "lzua mxdq aiha slcy",
  },
});

transporter
  .verify()
  .then(() => console.log("Email listening"))
  .catch((error) => console.log("error message: ", error));
