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

const store = process.env.STORE ?? 'sql';
const dao = (await import(`./dao/${store}.js`)).default;

app.get('/api/info', (_, res) => res.json({ store }));

/**
 * MODIFY HERE
 **/   

// Helper for UI tables (pre-provided so the page can render)
app.get('/api/tables', async (_, res) => res.json(await dao.listTables?.() ?? {}));

const port = Number(process.env.PORT || 3001);
app.listen(port, () => console.log(`API on ${port} using STORE=${store}`));
