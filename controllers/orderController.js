import db from "../config/db.js";

// GET ALL ORDERS (ADMIN)
export const getOrders = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM orders ORDER BY id DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await db.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id]
    );

    res.json({ message: "Order status updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET ORDER DETAILS (ADMIN)
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const [[order]] = await db.query(
      "SELECT * FROM orders WHERE id = ?",
      [id]
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await db.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [id]
    );

    res.json({
      order,
      items
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE ORDER (USER)
export const createOrder = async (req, res) => {
  try {
    const { customer_name, customer_email, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Calculate total
    let total = 0;
    items.forEach(i => {
      total += i.price * i.quantity;
    });

    // Insert order
    const [result] = await db.query(
      `INSERT INTO orders (customer_name, customer_email, total)
       VALUES (?, ?, ?)`,
      [customer_name, customer_email, total]
    );

    const orderId = result.insertId;

    // Insert order items
    for (const item of items) {
      await db.query(
        `INSERT INTO order_items
         (order_id, product_name, price, quantity)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.name, item.price, item.quantity]
      );
    }

    res.status(201).json({
      message: "Order placed successfully",
      orderId
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

