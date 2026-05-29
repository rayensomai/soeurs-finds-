import { useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  fetchCategories,
  formatPrice,
} from '../api';

const EMPTY_FORM = {
  category_id: '',
  name: '',
  description: '',
  price: '',
  image: '',
  featured: false,
};

export default function AdminProducts({ password }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
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
      if (!form.category_id && categoriesData.length > 0) {
        setForm((prev) => ({ ...prev, category_id: categoriesData[0].id }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      await createProduct(
        {
          ...form,
          price: parseFloat(form.price),
          featured: form.featured,
        },
        password
      );
      setForm({ ...EMPTY_FORM, category_id: categories[0]?.id || '' });
      setSuccess('Produit ajouté avec succès !');
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Supprimer « ${product.name} » ?`)) return;

    try {
      await deleteProduct(product.id, password);
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
          <h2 className="font-display text-xl font-bold text-gray-900">Ajouter un article</h2>
          <p className="mt-1 text-sm text-gray-600">Prix en dollars canadiens (CAD)</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">URL de l'image</label>
              <input
                type="url"
                className="input-field"
                placeholder="https://..."
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </div>

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

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Ajout en cours...' : 'Ajouter le produit'}
            </button>
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
            {products.map((product) => (
              <div
                key={product.id}
                className="glass-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-16 w-16 rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">
                      📦
                    </div>
                  )}
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
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

                <button
                  onClick={() => handleDelete(product)}
                  className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
                >
                  Supprimer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
