import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
app.use(cors({
  origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const store = process.env.STORE ?? 'sql';
const dao = (await import(`./dao/${store}.js`)).default;

app.get('/api/info', (_, res) => res.json({ store }));

app.get('/api/products', async (_, res) => res.json(await dao.listProducts()));
app.post('/api/orders',   async (req, res) => res.json(await dao.createOrder(req.body)));

app.get('/api/orders/all', async (_, res) => res.json(await dao.listAllOrders()));
app.get('/api/orders/:id', async (req, res) => res.json(await dao.getOrder(req.params.id)));

app.get('/api/tables', async (_, res) => res.json(await dao.listTables?.() ?? {}));
app.post('/api/admin/reset', async (_, res) => {
  await dao.reset?.();
  res.json({ ok: true });
});

const port = Number(process.env.PORT || 3001);
app.listen(port, () =>
  console.log(`API on ${port} using STORE=${store}`)
);
