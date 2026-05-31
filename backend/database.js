import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getDbPath,
  migrateLegacyDatabase,
  restoreIfEmpty,
  saveBackup,
} from './persistence.js';
import { downloadRemoteBackup, uploadRemoteBackup } from './cloudBackup.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = getDbPath();

migrateLegacyDatabase(path.join(__dirname, 'soeurs-finds.db'), dbPath);

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
db.pragma('synchronous = FULL');

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    image TEXT,
    featured INTEGER DEFAULT 0,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_id INTEGER NOT NULL,
    product_name TEXT NOT NULL,
    prenom TEXT NOT NULL,
    nom TEXT NOT NULL,
    telephone TEXT NOT NULL,
    status TEXT DEFAULT 'nouveau',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (product_id) REFERENCES products(id)
  );
`);

const productColumnNames = db.prepare('PRAGMA table_info(products)').all().map((col) => col.name);
if (!productColumnNames.includes('images')) {
  db.exec('ALTER TABLE products ADD COLUMN images TEXT');
}
if (!productColumnNames.includes('status')) {
  db.exec("ALTER TABLE products ADD COLUMN status TEXT DEFAULT 'disponible'");
}

await downloadRemoteBackup();
restoreIfEmpty(db);

const insertCategory = db.prepare(
  'INSERT OR IGNORE INTO categories (id, name, description, icon, color) VALUES (?, ?, ?, ?, ?)'
);

const allCategories = [
  ['cuisine', 'Cuisine', 'Ustensiles, appareils et accessoires pour une cuisine moderne', '🍳', '#E85D4C'],
  ['bien-etre', 'Bien-être', 'Produits de relaxation, beauté et confort au quotidien', '🌿', '#6B9E78'],
  ['lumiere', 'Lumière', 'Éclairage design pour sublimer votre intérieur', '✨', '#D4A853'],
  ['sport-divertissement', 'Sport & Divertissement', 'Équipements sportifs et loisirs pour toute la famille', '⚽', '#4A90D9'],
  ['technologie', 'Technologie', 'Gadgets, accessoires et innovations pour le quotidien', '💻', '#6366F1'],
  ['jardinage', 'Jardinage', 'Outils, plantes et décorations pour votre jardin', '🌱', '#22C55E'],
];

for (const cat of allCategories) {
  insertCategory.run(...cat);
}

const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();

if (productCount.count === 0) {
  const insertProduct = db.prepare(
    'INSERT INTO products (category_id, name, description, price, image, featured, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  );

  const products = [
    ['cuisine', 'Robot Multifonction Pro', 'Mixeur, hachoir et blender en un seul appareil puissant', 249.99, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&h=600&fit=crop', 1, 'disponible'],
    ['cuisine', 'Set Casseroles Premium', '5 pièces en inox avec revêtement anti-adhésif', 179.99, 'https://images.unsplash.com/photo-1584990347449-7f35d909a4a7?w=600&h=600&fit=crop', 1, 'disponible'],
    ['cuisine', 'Machine à Café Espresso', 'Café barista à domicile, mousse parfaite', 329.99, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop', 0, 'disponible'],
    ['cuisine', 'Planche à Découper Bambou', 'Élégante et durable, idéale pour la cuisine', 44.99, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&h=600&fit=crop', 0, 'disponible'],

    ['bien-etre', 'Diffuseur Huiles Essentielles', 'Ambiance zen avec lumière LED apaisante', 64.99, 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&h=600&fit=crop', 1, 'disponible'],
    ['bien-etre', 'Masque Visage LED Thérapie', 'Soin anti-âge technologique à domicile', 119.99, 'https://images.unsplash.com/photo-1570172619644-dfd955f3975e?w=600&h=600&fit=crop', 1, 'disponible'],
    ['bien-etre', 'Coussin Massage Shiatsu', 'Détente du cou et des épaules après une longue journée', 99.99, 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=600&fit=crop', 0, 'disponible'],
    ['bien-etre', 'Set Soins Naturels Bio', 'Crèmes et sérums 100% naturels', 79.99, 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&h=600&fit=crop', 0, 'disponible'],

    ['lumiere', 'Lampe Design Arc', 'Éclairage sculptural pour salon moderne', 219.99, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop', 1, 'disponible'],
    ['lumiere', 'Guirlande LED Smart', '16 millions de couleurs, contrôle via app', 54.99, 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&h=600&fit=crop', 1, 'disponible'],
    ['lumiere', 'Applique Murale Dorée', 'Élégance et chaleur pour votre intérieur', 94.99, 'https://images.unsplash.com/photo-1524484382368-2a0d3d12a0b0?w=600&h=600&fit=crop', 0, 'disponible'],
    ['lumiere', 'Lampe de Chevet Touch', '3 intensités, design minimaliste', 59.99, 'https://images.unsplash.com/photo-1507473885765-e6ed623f0fe6?w=600&h=600&fit=crop', 0, 'disponible'],

    ['sport-divertissement', 'Tapis de Yoga Premium', 'Antidérapant, épais et confortable', 69.99, 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b0f?w=600&h=600&fit=crop', 1, 'disponible'],
    ['sport-divertissement', 'Haltères Ajustables 20kg', 'Entraînement complet à domicile', 159.99, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=600&fit=crop', 1, 'disponible'],
    ['sport-divertissement', 'Raquette Padel Pro', 'Carbone haute performance', 199.99, 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=600&fit=crop', 0, 'disponible'],
    ['sport-divertissement', 'Console Retro Gaming', '500 jeux classiques, 2 manettes', 99.99, 'https://images.unsplash.com/photo-1486401899868-0e435ed85128?w=600&h=600&fit=crop', 0, 'disponible'],

    ['technologie', 'Écouteurs Sans Fil Pro', 'Réduction de bruit active et autonomie 30h', 149.99, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop', 1, 'disponible'],
    ['technologie', 'Montre Connectée Sport', 'GPS, fréquence cardiaque et notifications', 199.99, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop', 1, 'disponible'],
    ['technologie', 'Enceinte Bluetooth Portable', 'Son puissant, résistante à l\'eau IPX7', 89.99, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop', 0, 'disponible'],
    ['technologie', 'Chargeur Sans Fil Rapide', 'Compatible iPhone et Android, charge 15W', 39.99, 'https://images.unsplash.com/photo-1591290619762-dca059548a62?w=600&h=600&fit=crop', 0, 'disponible'],

    ['jardinage', 'Kit Outils Jardin 12 pièces', 'Tout l\'essentiel pour entretenir votre jardin', 74.99, 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&h=600&fit=crop', 1, 'disponible'],
    ['jardinage', 'Tuyau Arrosage Extensible', '15 mètres, léger et sans nœuds', 49.99, 'https://images.unsplash.com/photo-1464226184884-fa280b87f399?w=600&h=600&fit=crop', 1, 'disponible'],
    ['jardinage', 'Potager Vertical Balcon', 'Cultivez herbes et légumes en ville', 129.99, 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&h=600&fit=crop', 0, 'disponible'],
    ['jardinage', 'Lanterne Solaire Jardin', 'Pack de 6, éclairage automatique la nuit', 59.99, 'https://images.unsplash.com/photo-1416339646337-79363a0a3ab2?w=600&h=600&fit=crop', 0, 'disponible'],
  ];

  for (const product of products) {
    insertProduct.run(...product);
  }
}

saveBackup(db);
console.log(`Données enregistrées dans : ${dbPath}`);

export function persistData() {
  saveBackup(db);
  uploadRemoteBackup().catch((err) => {
    console.error('Sauvegarde cloud :', err.message);
  });
}

export default db;
