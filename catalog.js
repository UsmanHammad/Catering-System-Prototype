// routes/catalog.js
// Read-only endpoints for food items, categories, and packages.

const express = require("express");
const router = express.Router();
const pool = require("../db");

// GET /api/categories
router.get("/categories", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Category");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

// GET /api/food-items            -> all available food items
// GET /api/food-items?category=2 -> filtered by CategoryID
router.get("/food-items", async (req, res) => {
  try {
    const { category } = req.query;
    let sql = "SELECT * FROM FoodItem WHERE Availability = TRUE";
    const params = [];
    if (category) {
      sql += " AND CategoryID = ?";
      params.push(category);
    }
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch food items" });
  }
});

// GET /api/packages
router.get("/packages", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM CateringPackage WHERE Availability = TRUE");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch packages" });
  }
});

module.exports = router;
