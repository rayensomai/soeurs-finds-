import { useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchCategories,
  formatPrice,
  getProductImages,
  getProductMainImage,
  updateProduct,
} from '../api';
import ProductImagesField from './ProductImagesField';

const EMPTY_FORM = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  images: [],
  featured: false,
  status: 'disponible',
};

function productToForm(product) {
  return {
    category_id: product.category_id,
    name: product.name,
    description: product.description || '',
    price: String(product.price),
    images: getProductImages(product),
    featured: !!product.featured,
    status: product.status || 'disponible',
  };
}

export default function AdminProducts({ password }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchAllProducts(password),
        fetchCategories(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setForm((prev) => ({
        ...prev,
        category_id: prev.category_id || categoriesData[0]?.id || '',
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [password]);

  const resetForm = () => {
    setEditingId(null);
    setForm({ ...EMPTY_FORM, category_id: categories[0]?.id || '' });
    setError('');
  };

  const startEdit = (product) => {
    setEditingId(product.id);
    setForm(productToForm(product));
    setError('');
    setSuccess('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const buildPayload = () => ({
    category_id: form.category_id,
    name: form.name,
    description: form.description,
    price: parseFloat(form.price),
    images: form.images,
    image: form.images[0] || '',
    featured: form.featured,
    status: form.status,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      if (editingId) {
        await updateProduct(editingId, buildPayload(), password);
        setSuccess('Produit modifié avec succès !');
        resetForm();
      } else {
        await createProduct(buildPayload(), password);
        setSuccess('Produit ajouté avec succès !');
        setForm({ ...EMPTY_FORM, category_id: categories[0]?.id || '' });
      }
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickStatus = async (product, status) => {
    try {
      await updateProduct(
        product.id,
        {
          ...productToForm(product),
          price: product.price,
          images: getProductImages(product),
          image: getProductMainImage(product) || '',
          featured: !!product.featured,
          status,
        },
        password
      );
      setSuccess(status === 'vendu' ? 'Produit marqué comme vendu.' : 'Produit marqué comme disponible.');
      await loadData();
      if (editingId === product.id) {
        setForm((prev) => ({ ...prev, status }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Supprimer « ${product.name} » ?`)) return;

    try {
      await deleteProduct(product.id, password);
      if (editingId === product.id) resetForm();
      setSuccess('Produit supprimé.');
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-3xl bg-gray-200" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="lg:col-span-2">
        <div className="glass-card p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold text-gray-900">
            {editingId ? 'Modifier l\'article' : 'Ajouter un article'}
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            {editingId ? 'Mettez à jour les informations du produit' : 'Prix en dollars canadiens (CAD)'}
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Statut *</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 'disponible' })}
                  className={`rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                    form.status === 'disponible'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-green-200'
                  }`}
                >
                  ✓ Disponible
                </button>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, status: 'vendu' })}
                  className={`rounded-2xl border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                    form.status === 'vendu'
                      ? 'border-gray-500 bg-gray-100 text-gray-700'
                      : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                  }`}
                >
                  Vendu
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Catégorie *</label>
              <select
                required
                className="input-field"
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Nom *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Nom du produit"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="input-field min-h-[100px] resize-y"
                placeholder="Description du produit"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Prix (CAD) *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                className="input-field"
                placeholder="Ex: 49.99"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </div>

            <ProductImagesField
              images={form.images}
              onChange={(images) => setForm({ ...form, images })}
              password={password}
            />

            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="h-5 w-5 rounded border-gray-300 text-brand-500 focus:ring-brand-400"
              />
              <span className="text-sm font-medium text-gray-700">Mettre en vedette (page d'accueil)</span>
            </label>

            {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
            {success && <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{success}</p>}

            <div className="flex gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-full border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                >
                  Annuler
                </button>
              )}
              <button type="submit" disabled={submitting} className="btn-primary flex-1">
                {submitting
                  ? 'Enregistrement...'
                  : editingId
                    ? 'Enregistrer les modifications'
                    : 'Ajouter le produit'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-3">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-gray-900">
            Tous les articles ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="glass-card py-16 text-center">
            <span className="text-4xl">📦</span>
            <p className="mt-3 text-gray-600">Aucun produit pour le moment</p>
          </div>
        ) : (
          <div className="space-y-3">
            {products.map((product) => {
              const mainImage = getProductMainImage(product);
              const isSold = product.status === 'vendu';
              const isEditing = editingId === product.id;

              return (
                <div
                  key={product.id}
                  className={`glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between ${
                    isEditing ? 'ring-2 ring-brand-300' : ''
                  } ${isSold ? 'opacity-80' : ''}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {mainImage ? (
                        <img
                          src={mainImage}
                          alt={product.name}
                          className={`h-16 w-16 rounded-2xl object-cover ${isSold ? 'grayscale' : ''}`}
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                          📦
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isSold ? 'bg-gray-200 text-gray-700' : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isSold ? 'Vendu' : 'Disponible'}
                        </span>
                        {product.featured ? (
                          <span className="rounded-full bg-gold/20 px-2 py-0.5 text-xs font-semibold text-amber-800">
                            Vedette
                          </span>
                        ) : null}
                      </div>
                      <p className="text-sm text-gray-600">{product.category_name}</p>
                      <p className="font-semibold text-brand-600">{formatPrice(product.price)}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => startEdit(product)}
                      className="rounded-full bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-brand-100"
                    >
                      Modifier
                    </button>
                    {isSold ? (
                      <button
                        onClick={() => handleQuickStatus(product, 'disponible')}
                        className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 hover:bg-green-100"
                      >
                        Remettre disponible
                      </button>
                    ) : (
                      <button
                        onClick={() => handleQuickStatus(product, 'vendu')}
                        className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
                      >
                        Marquer vendu
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(product)}
                      className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
