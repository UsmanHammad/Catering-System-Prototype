/* ============================================================
   api.js
   Replaces data.js's hardcoded arrays with real fetch() calls
   to the Express + MySQL backend (backend/server.js).

   Usage: swap <script src="js/data.js"> for <script src="js/api.js">
   in each HTML page. The functions below return Promises, so
   page scripts need small `async`/`.then()` adjustments - see
   the notes at the bottom of this file.
   ============================================================ */

const API_BASE = "/api";

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/categories`);
  return res.json();
}

async function fetchFoodItems(categoryId) {
  const url = categoryId && categoryId !== "all"
    ? `${API_BASE}/food-items?category=${categoryId}`
    : `${API_BASE}/food-items`;
  const res = await fetch(url);
  return res.json();
}

async function fetchPackages() {
  const res = await fetch(`${API_BASE}/packages`);
  return res.json();
}

async function submitOrder(order) {
  const res = await fetch(`${API_BASE}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order)
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Order submission failed");
  }
  return res.json(); // { orderId, status }
}

async function fetchOrders() {
  const res = await fetch(`${API_BASE}/orders`);
  return res.json();
}

async function setOrderStatus(orderId, status) {
  const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
  return res.json();
}

/* ---------------- Admin auth ---------------- */

async function adminLogin(username, password) {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Login failed");
  }
  return res.json();
}

function requireAdminLogin() {
  if (sessionStorage.getItem("isAdmin") !== "true") {
    window.location.href = "admin-login.html";
  }
}

/* ---------------- Admin: Food Items ---------------- */

async function addFoodItem(item) {
  const res = await fetch(`${API_BASE}/food-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

async function updateFoodItem(id, item) {
  const res = await fetch(`${API_BASE}/food-items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item)
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

async function deleteFoodItem(id) {
  const res = await fetch(`${API_BASE}/food-items/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

/* ---------------- Admin: Packages ---------------- */

async function addPackage(pkg) {
  const res = await fetch(`${API_BASE}/packages`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pkg)
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

async function updatePackage(id, pkg) {
  const res = await fetch(`${API_BASE}/packages/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pkg)
  });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

async function deletePackage(id) {
  const res = await fetch(`${API_BASE}/packages/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error((await res.json()).error);
  return res.json();
}

/* ------------------------------------------------------------
   NOTES ON UPDATING EACH PAGE'S INLINE SCRIPT:

   index.html / menu.html:
     Replace `PACKAGES.forEach(...)` with:
       fetchPackages().then(packages => { packages.forEach(pkg => {...}) });

   menu.html food grid:
     Replace `FOOD_ITEMS.filter(...)` with:
       fetchFoodItems(categoryId).then(items => { ...render items... });

   order.html submit handler:
     Replace `const saved = saveOrder(order);` with:
       submitOrder(order)
         .then(saved => { document.getElementById("order-ref").textContent = "ORD-" + saved.orderId; ... })
         .catch(err => alert(err.message));

   admin.html:
     Replace `getOrders()` with `await fetchOrders()`, and the
     onchange handler's `updateOrderStatus(id, status)` call with
     `setOrderStatus(id, status).then(() => render())`.
   ------------------------------------------------------------ */
