import fs from 'fs';
const file = 'json-store.json';

if (!fs.existsSync(file)) {
  fs.writeFileSync(file, JSON.stringify({
    products: [
      {id:1, name:'Keyboard', price_cents:4999},
      {id:2, name:'Mouse',    price_cents:2999},
      {id:3, name:'Monitor',  price_cents:19999}
    ],
    orders: []
  }, null, 2));
}

const load = () => JSON.parse(fs.readFileSync(file, 'utf8'));
const save = (db) => fs.writeFileSync(file, JSON.stringify(db, null, 2));

export default {
  async listProducts() {
    return load().products;
  },
  async createOrder({ customer, items }) {
    const db = load();
    const id = (db.orders.at(-1)?.id ?? 0) + 1;
    const resolved = items.map(it => {
      const p = db.products.find(p => p.id === it.productId);
      return { product_id: it.productId, name: p.name, price_cents: p.price_cents, qty: it.qty };
    });
    const order = { id, customer, created_at: new Date().toISOString(), items: resolved };
    db.orders.push(order); save(db); return order;
  },
  async getOrder(id) {
    const db = load();
    return db.orders.find(o => o.id === Number(id)) ?? null;
  },
    async listAllOrders() {
    const db = load();
    return db.orders; 
  },

  async listTables() {
    const db = load();
    const products = db.products;
    const orders = db.orders.map(({ id, customer, created_at }) => ({ id, customer, created_at }));
    const order_items = db.orders.flatMap(o =>
      o.items.map(it => ({
        order_id: o.id,
        product_id: it.product_id ?? db.products.find(p => p.name === it.name)?.id ?? null,
        qty: it.qty
      }))
    );
    return { products, orders, order_items };
  },

  async reset() {
  const initial = {
    products: [
      {id:1, name:'Keyboard', price_cents:4999},
      {id:2, name:'Mouse',    price_cents:2999},
      {id:3, name:'Monitor',  price_cents:19999}
    ],
    orders: []
  };
  fs.writeFileSync(file, JSON.stringify(initial, null, 2));
}


};
