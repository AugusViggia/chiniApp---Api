import express from "express";
import paymentRoutes from "./mercadoPago/src/routes/payment.routes.js";
import nodemailerRoutes from "./nodemailer/src/routes/nodemailer.routes.js";
import { PORT } from "./mercadoPago/config.js";
import morgan from "morgan";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from 'dotenv';

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(paymentRoutes);
app.use(nodemailerRoutes);

app.listen(PORT);
console.log("Server listening on port", PORT);
