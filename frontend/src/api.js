const API = '/api';

function adminHeaders(adminPassword) {
  return { 'x-admin-password': adminPassword };
}

export async function fetchCategories() {
  const res = await fetch(`${API}/categories`);
  if (!res.ok) throw new Error('Erreur chargement catégories');
  return res.json();
}

export async function fetchProductsByCategory(categoryId) {
  const res = await fetch(`${API}/categories/${categoryId}/products`);
  if (!res.ok) throw new Error('Erreur chargement produits');
  return res.json();
}

export async function fetchFeaturedProducts() {
  const res = await fetch(`${API}/products/featured`);
  if (!res.ok) throw new Error('Erreur chargement produits');
  return res.json();
}

export async function createOrder({ product_id, prenom, nom, telephone }) {
  const res = await fetch(`${API}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id, prenom, nom, telephone }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erreur lors de la commande');
  return data;
}

export async function fetchOrders(adminPassword) {
  let res;
  try {
    res = await fetch(`${API}/orders`, { headers: adminHeaders(adminPassword) });
  } catch {
    throw new Error('SERVEUR_INACCESSIBLE');
  }
  if (res.status === 401) throw new Error('MOT_DE_PASSE_INCORRECT');
  if (!res.ok) throw new Error('ERREUR_SERVEUR');
  return res.json();
}

export async function fetchNewOrderCount(adminPassword) {
  let res;
  try {
    res = await fetch(`${API}/orders/new-count`, { headers: adminHeaders(adminPassword) });
  } catch {
    throw new Error('SERVEUR_INACCESSIBLE');
  }
  if (res.status === 401) throw new Error('MOT_DE_PASSE_INCORRECT');
  if (!res.ok) throw new Error('ERREUR_SERVEUR');
  return res.json();
}

export async function updateOrderStatus(id, status, adminPassword) {
  const res = await fetch(`${API}/orders/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...adminHeaders(adminPassword),
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Erreur mise à jour');
  return res.json();
}

export async function fetchAllProducts(adminPassword) {
  const res = await fetch(`${API}/products`, { headers: adminHeaders(adminPassword) });
  if (!res.ok) throw new Error('Accès refusé');
  return res.json();
}

export async function createProduct(data, adminPassword) {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...adminHeaders(adminPassword),
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de l\'ajout');
  return result;
}

export async function uploadImage(file, adminPassword) {
  const data = await readFileAsDataUrl(file);
  const res = await fetch(`${API}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...adminHeaders(adminPassword),
    },
    body: JSON.stringify({ data, filename: file.name }),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors du téléversement');
  return result.url;
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getProductImages(product) {
  if (product?.images) {
    try {
      const parsed = JSON.parse(product.images);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      /* ignore */
    }
  }
  return product?.image ? [product.image] : [];
}

export function getProductMainImage(product) {
  return getProductImages(product)[0] || null;
}

export function isProductAvailable(product) {
  return !product?.status || product.status === 'disponible';
}

export async function updateProduct(id, data, adminPassword) {
  const res = await fetch(`${API}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...adminHeaders(adminPassword),
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la modification');
  return result;
}

export async function deleteProduct(id, adminPassword) {
  const res = await fetch(`${API}/products/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(adminPassword),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression');
  return result;
}

export async function createCategory(data, adminPassword) {
  const res = await fetch(`${API}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...adminHeaders(adminPassword),
    },
    body: JSON.stringify(data),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de l\'ajout');
  return result;
}

export async function deleteCategory(id, adminPassword) {
  const res = await fetch(`${API}/categories/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(adminPassword),
  });
  const result = await res.json();
  if (!res.ok) throw new Error(result.error || 'Erreur lors de la suppression');
  return result;
}

export function formatPrice(price) {
  if (price == null) return '—';
  return new Intl.NumberFormat('fr-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(dateStr) {
  const normalized = dateStr.includes('T') ? dateStr : `${dateStr.replace(' ', 'T')}Z`;
  return new Intl.DateTimeFormat('fr-CA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Toronto',
  }).format(new Date(normalized));
}

export function formatPhoneDisplay(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  if (digits.length === 11 && digits.startsWith('1')) {
    return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
  }
  return phone;
}
