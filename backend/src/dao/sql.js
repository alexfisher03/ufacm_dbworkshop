import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, '../../workshop.db'));

const schema = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
db.exec(schema);
const seed = fs.readFileSync(path.join(__dirname, '../sql/seed.sql'), 'utf8');
db.exec(seed);

export default {
  listProducts() {
    console.log('Listing products from SQL database');
    return db.prepare('SELECT id, name, price_cents FROM products ORDER BY id').all();
  },
  createOrder({ customer, items }) {
    const tx = db.transaction((customer, items) => {
      const order = db.prepare(
        'INSERT INTO orders (customer) VALUES (?) RETURNING id, customer, created_at'
      ).get(customer);
      const ins = db.prepare(
        'INSERT INTO order_items (order_id, product_id, qty) VALUES (?,?,?)'
      );
      for (const it of items) ins.run(order.id, it.productId, it.qty);
      return order;
    });
    return tx(customer, items);
  },
  getOrder(id) {
    const order = db.prepare(
      'SELECT id, customer, created_at FROM orders WHERE id=?'
    ).get(id);
    if (!order) return null;
    const items = db.prepare(
      `SELECT p.name, p.price_cents, oi.qty
       FROM order_items oi JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id=?`
    ).all(id);
    return { ...order, items };
  },
    listAllOrders() {
    const orders = db.prepare(
      'SELECT id, customer, created_at FROM orders ORDER BY id'
    ).all();
    return orders.map(order => {
      const items = db.prepare(
        `SELECT p.name, p.price_cents, oi.qty
         FROM order_items oi JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id=?`
      ).all(order.id);
      return { ...order, items };
    });
  },

  listTables() {
    const products = db.prepare('SELECT id, name, price_cents FROM products ORDER BY id').all();
    const orders   = db.prepare('SELECT id, customer, created_at FROM orders ORDER BY id').all();
    const order_items = db.prepare(
      'SELECT order_id, product_id, qty FROM order_items ORDER BY order_id, product_id'
    ).all();
    return { products, orders, order_items };
  },
  async reset() {
    db.exec(`
        PRAGMA foreign_keys = OFF;
        BEGIN;
        DROP TABLE IF EXISTS order_items;
        DROP TABLE IF EXISTS orders;
        DROP TABLE IF EXISTS products;
        COMMIT;
        VACUUM;
    `);
    const fs = await import('fs');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const schema = fs.readFileSync(path.join(__dirname, '../sql/schema.sql'), 'utf8');
    const seed   = fs.readFileSync(path.join(__dirname, '../sql/seed.sql'), 'utf8');
    db.exec(schema);
    db.exec(seed);
    }


};
