import { readFileSync, writeFileSync } from 'fs';
import { getBackupPath } from './persistence.js';

const SUPABASE_URL = process.env.SUPABASE_URL?.replace(/\/$/, '');
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const BUCKET = process.env.SUPABASE_BUCKET || 'soeurs-finds';
const BACKUP_FILE = 'backup.json';

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_KEY);
}

function storageUrl() {
  return `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${BACKUP_FILE}`;
}

export async function downloadRemoteBackup() {
  if (!isConfigured()) return false;

  try {
    const res = await fetch(storageUrl(), {
      headers: { Authorization: `Bearer ${SUPABASE_SERVICE_KEY}` },
    });

    if (res.status === 404) return false;
    if (!res.ok) {
      console.error('Sauvegarde cloud : téléchargement impossible →', res.status);
      return false;
    }

    const text = await res.text();
    writeFileSync(getBackupPath(), text, 'utf-8');
    console.log('Sauvegarde cloud restaurée depuis Supabase.');
    return true;
  } catch (err) {
    console.error('Sauvegarde cloud :', err.message);
    return false;
  }
}

export async function uploadRemoteBackup() {
  if (!isConfigured()) return false;

  try {
    const body = readFileSync(getBackupPath(), 'utf-8');
    const res = await fetch(storageUrl(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'x-upsert': 'true',
      },
      body,
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error('Sauvegarde cloud : envoi impossible →', res.status, detail);
      return false;
    }

    return true;
  } catch (err) {
    console.error('Sauvegarde cloud :', err.message);
    return false;
  }
}

export function cloudBackupEnabled() {
  return isConfigured();
}
