import nodemailer from "nodemailer";


export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "chiniBakery00@gmail.com",
    pass: "lzua mxdq aiha slcy",
  },
});

transporter
  .verify()
  .then(() => console.log("Email listening"))
  .catch((error) => console.log("error message: ", error));
