import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import db from './database.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');

const app = express();
const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const SITE_URL = process.env.RENDER_EXTERNAL_URL || process.env.SITE_URL || `http://localhost:${PORT}`;

app.use(cors());
app.use(express.json());

function checkAdmin(req, res, next) {
  const password = req.headers['x-admin-password'];
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Accès non autorisé' });
  }
  next();
}

app.get('/api/categories', (_req, res) => {
  const categories = db.prepare('SELECT * FROM categories ORDER BY name').all();
  res.json(categories);
});

app.get('/api/categories/:id/products', (req, res) => {
  const products = db
    .prepare('SELECT * FROM products WHERE category_id = ? ORDER BY featured DESC, name')
    .all(req.params.id);
  res.json(products);
});

app.get('/api/products/featured', (_req, res) => {
  const products = db
    .prepare(`
      SELECT p.*, c.name as category_name, c.color as category_color
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.featured = 1
      ORDER BY p.id DESC
      LIMIT 8
    `)
    .all();
  res.json(products);
});

app.get('/api/products', checkAdmin, (_req, res) => {
  const products = db
    .prepare(`
      SELECT p.*, c.name as category_name, c.color as category_color
      FROM products p
      JOIN categories c ON p.category_id = c.id
      ORDER BY c.name, p.name
    `)
    .all();
  res.json(products);
});

app.post('/api/products', checkAdmin, (req, res) => {
  const { category_id, name, description, price, image, featured } = req.body;

  if (!category_id || !name?.trim() || price == null || Number.isNaN(Number(price))) {
    return res.status(400).json({ error: 'Catégorie, nom et prix sont obligatoires' });
  }

  const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
  if (!category) {
    return res.status(400).json({ error: 'Catégorie invalide' });
  }

  const result = db
    .prepare(`
      INSERT INTO products (category_id, name, description, price, image, featured)
      VALUES (?, ?, ?, ?, ?, ?)
    `)
    .run(
      category_id,
      name.trim(),
      description?.trim() || '',
      Number(price),
      image?.trim() || '',
      featured ? 1 : 0
    );

  const product = db
    .prepare(`
      SELECT p.*, c.name as category_name, c.color as category_color
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `)
    .get(result.lastInsertRowid);

  res.status(201).json(product);
});

app.delete('/api/products/:id', checkAdmin, (req, res) => {
  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }

  const orderCount = db
    .prepare('SELECT COUNT(*) as count FROM orders WHERE product_id = ?')
    .get(req.params.id);

  if (orderCount.count > 0) {
    return res.status(400).json({
      error: 'Impossible de supprimer : ce produit a des commandes associées',
    });
  }

  db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
  res.json({ message: 'Produit supprimé avec succès' });
});

app.get('/api/products/:id', (req, res) => {
  const product = db
    .prepare(`
      SELECT p.*, c.name as category_name
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `)
    .get(req.params.id);

  if (!product) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }
  res.json(product);
});

app.post('/api/orders', (req, res) => {
  const { product_id, prenom, nom, telephone } = req.body;

  if (!product_id || !prenom?.trim() || !nom?.trim() || !telephone?.trim()) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
  }

  const product = db.prepare('SELECT * FROM products WHERE id = ?').get(product_id);
  if (!product) {
    return res.status(404).json({ error: 'Produit introuvable' });
  }

  const result = db
    .prepare(`
      INSERT INTO orders (product_id, product_name, prenom, nom, telephone)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(product_id, product.name, prenom.trim(), nom.trim(), telephone.trim());

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(result.lastInsertRowid);

  res.status(201).json({
    message: 'Commande reçue ! Nous vous contacterons très bientôt.',
    order,
  });
});

app.get('/api/orders', checkAdmin, (_req, res) => {
  const orders = db
    .prepare(`
      SELECT o.*, p.price, p.image, c.name as category_name
      FROM orders o
      LEFT JOIN products p ON o.product_id = p.id
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY o.created_at DESC
    `)
    .all();
  res.json(orders);
});

app.get('/api/orders/new-count', checkAdmin, (_req, res) => {
  const result = db
    .prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'nouveau'")
    .get();
  res.json(result);
});

app.patch('/api/orders/:id/status', checkAdmin, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['nouveau', 'contacte', 'confirme', 'annule'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Statut invalide' });
  }

  const result = db
    .prepare('UPDATE orders SET status = ? WHERE id = ?')
    .run(status, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Commande introuvable' });
  }

  const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(req.params.id);
  res.json(order);
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/sitemap.xml', (_req, res) => {
  const categories = db.prepare('SELECT id FROM categories').all();
  const urls = [
    '',
    ...categories.map((c) => `/categorie/${c.id}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${SITE_URL}${url}</loc>
    <changefreq>weekly</changefreq>
  </url>`
  )
  .join('\n')}
</urlset>`;

  res.type('application/xml').send(xml);
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(`User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`);
});

if (existsSync(frontendDist)) {
  app.use(express.static(frontendDist));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Soeurs Finds en ligne → ${SITE_URL}`);
});
