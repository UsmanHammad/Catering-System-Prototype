// server.js
const express = require("express");
const cors = require("cors");
const path = require("path");

const catalogRoutes = require("./routes/catalog");
const orderRoutes = require("./routes/orders");
const adminRoutes = require("./routes/admin");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", catalogRoutes);
app.use("/api", orderRoutes);
app.use("/api", adminRoutes);

// Serve the existing front-end (index.html, menu.html, etc.) from the parent folder,
// so you don't need XAMPP's Apache to serve the pages at all - Node serves everything.
app.use(express.static(path.join(__dirname, "..")));

app.listen(PORT, () => {
  console.log(`Catering server running at http://localhost:${PORT}`);
  console.log(`Make sure XAMPP's MySQL service is running before placing orders.`);
});
