import express from "express";
import paymentRoutes from "./mercadoPago/src/routes/payment.routes.js";
import { PORT } from "./mercadoPago/config.js";
import morgan from "morgan";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(paymentRoutes);

app.listen(PORT);
console.log("Server listening on port", PORT);
