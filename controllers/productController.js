import db from "../config/db.js";

// ✅ CREATE PRODUCT (ADMIN)
export const createProduct = async (req, res) => {
  try {
    const { name, price, brand, category, stock, description, image } = req.body;

    await db.query(
      `INSERT INTO products 
      (name, price, brand, category, stock, description, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, price, brand, category, stock, description, image]
    );

    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET ALL PRODUCTS (PUBLIC)
export const getProducts = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM products ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET SINGLE PRODUCT
export const getProductById = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ?",
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PRODUCT (ADMIN)
export const updateProduct = async (req, res) => {
  try {
    const { name, price, brand, category, stock, description, image } = req.body;

    await db.query(
      `UPDATE products SET 
        name = ?, price = ?, brand = ?, category = ?, stock = ?, 
        description = ?, image = ?
       WHERE id = ?`,
      [name, price, brand, category, stock, description, image, req.params.id]
    );

    res.json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ DELETE PRODUCT (ADMIN)
export const deleteProduct = async (req, res) => {
  try {
    await db.query(
      "DELETE FROM products WHERE id = ?",
      [req.params.id]
    );

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
