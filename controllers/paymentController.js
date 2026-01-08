import Razorpay from "razorpay";
import crypto from "crypto";
import db from "../config/db.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// CREATE RAZORPAY ORDER
export const createRazorpayOrder = async (req, res) => {
  const { orderId, amount } = req.body;

  const options = {
    amount: amount * 100, // paise
    currency: "INR",
    receipt: "order_" + orderId
  };

  const order = await razorpay.orders.create(options);

  res.json({
    order,
    key: process.env.RAZORPAY_KEY_ID
  });
};

// VERIFY PAYMENT
export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId
  } = req.body;

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  // UPDATE ORDER AS PAID
  await db.query(
    `UPDATE orders
     SET payment_id=?, payment_status='paid'
     WHERE id=?`,
    [razorpay_payment_id, orderId]
  );

  res.json({ message: "Payment successful" });
};
