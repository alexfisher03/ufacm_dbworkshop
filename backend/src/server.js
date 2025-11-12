import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();

app.use(cors());
app.use(express.json());

// Dynamically load the DAO based on STORE (sql | json)
const store = process.env.STORE ?? 'sql';
const dao = (await import(`./dao/${store}.js`)).default;

// helper so the UI can show which backend is active
app.get('/api/info', (_, res) => res.json({ store }));

// ----------------------
// 1) GET  /api/products
// 2) POST /api/orders
// 3) GET  /api/orders/all
// --- Implement Here ---


const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API on ${port} using STORE=${store}`));
