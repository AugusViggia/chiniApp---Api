import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "chiniBakery00@gmail.com",
    pass: process.env.AUTH_PASS,
  },
});

transporter
  .verify()
  .then(() => console.log("Email listening"))
  .catch((error) => console.log("error message: ", error));
