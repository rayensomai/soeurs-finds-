import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import path from 'path';
import os from 'os';

export function getDataDir() {
  if (process.env.SOEURS_FINDS_DATA) {
    const dir = process.env.SOEURS_FINDS_DATA;
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    return dir;
  }

  const base =
    process.platform === 'win32'
      ? path.join(process.env.LOCALAPPDATA || os.homedir(), 'SoeursFinds')
      : path.join(os.homedir(), '.soeurs-finds');

  const dir = path.join(base, 'data');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

export function getDbPath() {
  return path.join(getDataDir(), 'soeurs-finds.db');
}

export function getUploadsDir() {
  const dir = path.join(getDataDir(), 'uploads');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  return dir;
}

export function getBackupPath() {
  return path.join(getDataDir(), 'backup.json');
}

export function migrateLegacyDatabase(legacyPath, targetPath) {
  if (existsSync(legacyPath) && !existsSync(targetPath)) {
    copyFileSync(legacyPath, targetPath);
    console.log('Base de données migrée vers un emplacement permanent.');
  }
}

export function saveBackup(db) {
  const backup = {
    version: 1,
    savedAt: new Date().toISOString(),
    categories: db.prepare('SELECT * FROM categories').all(),
    products: db.prepare('SELECT * FROM products').all(),
    orders: db.prepare('SELECT * FROM orders').all(),
  };

  writeFileSync(getBackupPath(), JSON.stringify(backup, null, 2), 'utf-8');
}

export function restoreFromBackup(db) {
  const backupPath = getBackupPath();
  if (!existsSync(backupPath)) return false;

  const backup = JSON.parse(readFileSync(backupPath, 'utf-8'));

  const restore = db.transaction(() => {
    db.exec('DELETE FROM orders');
    db.exec('DELETE FROM products');
    db.exec('DELETE FROM categories');

    const insertCategory = db.prepare(
      'INSERT INTO categories (id, name, description, icon, color) VALUES (?, ?, ?, ?, ?)'
    );
    for (const cat of backup.categories || []) {
      insertCategory.run(cat.id, cat.name, cat.description, cat.icon, cat.color);
    }

    const insertProduct = db.prepare(`
      INSERT INTO products (id, category_id, name, description, price, image, images, featured, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const p of backup.products || []) {
      insertProduct.run(
        p.id,
        p.category_id,
        p.name,
        p.description,
        p.price,
        p.image,
        p.images,
        p.featured,
        p.status || 'disponible'
      );
    }

    const insertOrder = db.prepare(`
      INSERT INTO orders (id, product_id, product_name, prenom, nom, telephone, status, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    for (const o of backup.orders || []) {
      insertOrder.run(
        o.id,
        o.product_id,
        o.product_name,
        o.prenom,
        o.nom,
        o.telephone,
        o.status,
        o.created_at
      );
    }
  });

  restore();
  return true;
}

export function restoreIfEmpty(db) {
  const backupPath = getBackupPath();
  if (!existsSync(backupPath)) return false;

  const backup = JSON.parse(readFileSync(backupPath, 'utf-8'));
  const backupProducts = backup.products?.length || 0;
  const backupOrders = backup.orders?.length || 0;

  if (backupProducts === 0 && backupOrders === 0) return false;

  const current = db
    .prepare(`
      SELECT
        (SELECT COUNT(*) FROM products) as products,
        (SELECT COUNT(*) FROM orders) as orders
    `)
    .get();

  const dataWasLost =
    current.products < backupProducts || current.orders < backupOrders;

  if (!dataWasLost) return false;

  restoreFromBackup(db);
  console.log('Données restaurées depuis la sauvegarde automatique.');
  return true;
}
