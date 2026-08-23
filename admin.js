// routes/admin.js
// Simple admin login + CRUD for food items and packages.
// This is intentionally basic (no sessions/JWT) since the assignment
// only needs a working, understandable admin flow, not production auth.

const express = require("express");
const router = express.Router();
const pool = require("../db");

// --- Hardcoded admin credentials for this prototype ---
// Change these, or move them to environment variables, before any real deployment.
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "admin123";

// POST /api/admin/login   body: { username, password }
router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: "Invalid username or password" });
  }
});

// ---------------- Food Items ----------------

// POST /api/food-items   body: { name, description, price, categoryId }
router.post("/food-items", async (req, res) => {
  const { name, description, price, categoryId } = req.body;
  if (!name || !price || !categoryId) {
    return res.status(400).json({ error: "name, price, and categoryId are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO FoodItem (Name, Description, Price, CategoryID, Availability) VALUES (?, ?, ?, ?, TRUE)",
      [name, description || "", price, categoryId]
    );
    res.status(201).json({ foodItemId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add food item" });
  }
});

// PUT /api/food-items/:id   body: { name, description, price, categoryId, availability }
router.put("/food-items/:id", async (req, res) => {
  const { name, description, price, categoryId, availability } = req.body;
  try {
    await pool.query(
      "UPDATE FoodItem SET Name=?, Description=?, Price=?, CategoryID=?, Availability=? WHERE FoodItemID=?",
      [name, description, price, categoryId, availability ? 1 : 0, req.params.id]
    );
    res.json({ updated: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update food item" });
  }
});

// DELETE /api/food-items/:id
router.delete("/food-items/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM FoodItem WHERE FoodItemID=?", [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    // Most likely cause: this item is referenced by an existing order or package.
    res.status(500).json({ error: "Failed to delete food item (it may be used in an existing order or package)" });
  }
});

// ---------------- Catering Packages ----------------

// POST /api/packages   body: { name, description, price }
router.post("/packages", async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !price) {
    return res.status(400).json({ error: "name and price are required" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO CateringPackage (Name, Description, Price, Availability) VALUES (?, ?, ?, TRUE)",
      [name, description || "", price]
    );
    res.status(201).json({ packageId: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add package" });
  }
});

// PUT /api/packages/:id
router.put("/packages/:id", async (req, res) => {
  const { name, description, price, availability } = req.body;
  try {
    await pool.query(
      "UPDATE CateringPackage SET Name=?, Description=?, Price=?, Availability=? WHERE PackageID=?",
      [name, description, price, availability ? 1 : 0, req.params.id]
    );
    res.json({ updated: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update package" });
  }
});

// DELETE /api/packages/:id
router.delete("/packages/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM CateringPackage WHERE PackageID=?", [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete package (it may be used in an existing order)" });
  }
});

module.exports = router;
