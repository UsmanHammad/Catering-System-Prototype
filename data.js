/* ============================================================
   data.js
   Front-end prototype mock data.
   This stands in for the SQL database described in db/schema.sql.
   Once the back-end (PHP/Node + MySQL) is built, these arrays will
   be replaced by fetch() calls to real API endpoints.
   ============================================================ */

const CATEGORIES = [
  { id: 1, name: "Starters" },
  { id: 2, name: "Mains" },
  { id: 3, name: "Desserts" },
  { id: 4, name: "Drinks" }
];

const FOOD_ITEMS = [
  { id: 1, name: "Garden Salad", description: "Fresh mixed greens, cherry tomato, house dressing", price: 15, categoryId: 1, available: true, img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Grilled Chicken", description: "Herb-marinated grilled chicken breast", price: 25, categoryId: 2, available: true, img: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Creamy Pasta", description: "Penne in a creamy garlic parmesan sauce", price: 20, categoryId: 2, available: true, img: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=500&q=80" },
  { id: 4, name: "Chocolate Brownie", description: "Warm brownie with vanilla ice cream", price: 12, categoryId: 3, available: true, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=500&q=80" },
  { id: 5, name: "Iced Lemon Tea", description: "Refreshing house-brewed lemon iced tea", price: 6, categoryId: 4, available: true, img: "https://images.unsplash.com/photo-1499638673689-79a0b5115d87?auto=format&fit=crop&w=500&q=80" }
];

const PACKAGES = [
  { id: 1, name: "Bronze Package", description: "Starter + Main for up to 20 guests", price: 350, available: true, img: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=500&q=80" },
  { id: 2, name: "Silver Package", description: "Starter + Main + Dessert for up to 40 guests", price: 650, available: true, img: "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=500&q=80" },
  { id: 3, name: "Gold Package", description: "Full course + drinks for up to 80 guests", price: 1200, available: true, img: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=500&q=80" }
];

// Orders are stored in localStorage so the admin dashboard and
// order confirmation can share state within the browser session.
function getOrders() {
  return JSON.parse(localStorage.getItem("orders") || "[]");
}

function saveOrder(order) {
  const orders = getOrders();
  order.id = orders.length ? orders[orders.length - 1].id + 1 : 1001;
  order.status = "Pending";
  order.orderDate = new Date().toISOString().split("T")[0];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  return order;
}

function updateOrderStatus(orderId, status) {
  const orders = getOrders();
  const order = orders.find(o => o.id === orderId);
  if (order) order.status = status;
  localStorage.setItem("orders", JSON.stringify(orders));
}
