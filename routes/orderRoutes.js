import express from "express";
import { getOrders, updateOrderStatus } from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { getOrderDetails } from "../controllers/orderController.js";
import { createOrder } from "../controllers/orderController.js";

const router = express.Router();

router.get("/", protect, adminOnly, getOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);
router.get("/:id", protect, adminOnly, getOrderDetails);


// USER CHECKOUT
router.post("/create", createOrder);
export default router;
