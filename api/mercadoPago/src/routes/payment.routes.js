import { Router } from "express";
import { createOrder, recieveWebhook, successEvent } from "../controllers/payment.controller.js";

const router = Router();

router.post("/create-order", createOrder);

router.get("/success", successEvent);

router.get("/failure", (req, res) => res.send("failure"));

router.get("/pending", (req, res) => res.send("pending"));

router.post("/webhook", recieveWebhook);

export default router;