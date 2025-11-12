CREATE TABLE IF NOT EXISTS products(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  price_cents INT NOT NULL
);
CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS order_items(
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL CHECK(qty > 0),
  PRIMARY KEY(order_id, product_id)
);
