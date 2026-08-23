// routes/orders.js
// Handles creating catering orders and updating their status (admin).

const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/orders
// body: { customerName, email, phone, eventDate, location, guests, packageId, notes }
router.post("/orders", async (req, res) => {
  const { customerName, email, phone, eventDate, location, guests, packageId } = req.body;

  // Server-side validation - never trust the front-end alone.
  if (!customerName || !email || !phone || !eventDate || !location || !guests) {
    return res.status(400).json({ error: "Missing required order fields" });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Find or create the customer by email
    let [existing] = await conn.query("SELECT CustomerID FROM Customer WHERE Email = ?", [email]);
    let customerId;
    if (existing.length) {
      customerId = existing[0].CustomerID;
    } else {
      const [result] = await conn.query(
        "INSERT INTO Customer (Name, Email, Phone) VALUES (?, ?, ?)",
        [customerName, email, phone]
      );
      customerId = result.insertId;
    }

    // Work out total price from the selected package, if any
    let totalPrice = 0;
    if (packageId) {
      const [pkg] = await conn.query("SELECT Price FROM CateringPackage WHERE PackageID = ?", [packageId]);
      if (pkg.length) totalPrice = pkg[0].Price;
    }

    const [orderResult] = await conn.query(
      `INSERT INTO \`Order\` (CustomerID, OrderDate, EventDate, EventLocation, GuestCount, Status, TotalPrice)
       VALUES (?, CURDATE(), ?, ?, ?, 'Pending', ?)`,
      [customerId, eventDate, location, guests, totalPrice]
    );

    await conn.commit();
    res.status(201).json({ orderId: orderResult.insertId, status: "Pending" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    conn.release();
  }
});

// GET /api/orders - for the admin dashboard
router.get("/orders", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT o.OrderID, c.Name AS CustomerName, o.EventDate, o.GuestCount, o.Status, o.TotalPrice
      FROM \`Order\` o
      JOIN Customer c ON o.CustomerID = c.CustomerID
      ORDER BY o.OrderID DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});

// PUT /api/orders/:id/status
// body: { status: "Confirmed" | "Completed" | "Cancelled" | "Pending" }
router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["Pending", "Confirmed", "Completed", "Cancelled"];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }
  try {
    await pool.query("UPDATE `Order` SET Status = ? WHERE OrderID = ?", [status, req.params.id]);
    res.json({ orderId: req.params.id, status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

module.exports = router;
