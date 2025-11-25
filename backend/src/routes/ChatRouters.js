import express from "express";
import { chatWithBot } from "../controllers/ChatController.js";

const router = express.Router();

router.post("/", chatWithBot);

export default router;