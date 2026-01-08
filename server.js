import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const app = express();

// dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.set("layout", "layouts/admin"); // 👈 DEFAULT LAYOUT

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/public", express.static("public"));
// pages
app.get("/admin/login", (req, res) => {
  res.render("login", { layout: false });
});

//show dashboard after login
app.get("/admin/dashboard", (req, res) => {
  res.render("dashboard", { title: "Dashboard" });
});

//show products page
app.get("/admin/products", (req, res) => {
  res.render("products", { title: "Products" });
});

//show add product page
app.get("/admin/products/add", (req, res) => {
  res.render("add-product", { title: "Add Product" });
});

//show edit product page
app.get("/admin/products/edit/:id", (req, res) => {
  res.render("edit-product", { title: "Edit Product" });
});

// Admin page
app.get("/admin/orders", (req, res) => {
  res.render("orders", { title: "Orders" });
});

app.get("/", (req, res) => {
  res.render("user/home" , { title: "Order Details" });
});


// Order details page
app.get("/admin/orders/:id", (req, res) => {
  res.render("order-details", { title: "Order Details" });
});

// Checkout page
app.get("/checkout", (req, res) => {
  res.render("checkout", { title: "Checkout" });
});


import db from "./config/db.js";

app.get("/shop", async (req, res) => {
  const [products] = await db.query(
    "SELECT id, name, price, image FROM products WHERE stock > 0"
  );

  res.render("user/products", { products ,  title: "Checkout" });
});


app.get("/product/:id", async (req, res) => {
  const { id } = req.params;

  const [[product]] = await db.query(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  if (!product) {
    return res.status(404).send("Product not found");
  }

  res.render("user/product-detail", {
    title: product.name + " — GOGGLES®",
    product
  });
});

app.get("/cart", (req, res) => {
  res.render("user/cart", {
    title: "Your Cart — GOGGLES®"
  });
});


app.use("/api/dashboard", dashboardRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running");
});




