import { useEffect, useState } from 'react';
import { createCategory, deleteCategory, fetchCategories } from '../api';

const EMPTY_FORM = {
  name: '',
  description: '',
  icon: '📦',
  color: '#E85D4C',
};

const PRESET_COLORS = ['#E85D4C', '#6B9E78', '#D4A853', '#4A90D9', '#6366F1', '#22C55E', '#EC4899', '#14B8A6'];

export default function AdminCategories({ password }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      setCategories(await fetchCategories());
      setError('');
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
      await createCategory(form, password);
      setForm(EMPTY_FORM);
      setSuccess('Catégorie ajoutée avec succès !');
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    if (!confirm(`Supprimer la catégorie « ${category.name} » ?`)) return;

    try {
      await deleteCategory(category.id, password);
      setSuccess('Catégorie supprimée.');
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
          <h2 className="font-display text-xl font-bold text-gray-900">Ajouter une catégorie</h2>
          <p className="mt-1 text-sm text-gray-600">Elle apparaîtra sur la page d'accueil et dans le menu</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Nom *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="Ex: Mode, Bébé, Auto..."
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Description</label>
              <textarea
                className="input-field min-h-[80px] resize-y"
                placeholder="Courte description de la catégorie"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Icône (emoji)</label>
              <input
                type="text"
                className="input-field"
                placeholder="📦"
                maxLength={4}
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Couleur</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, color: c })}
                    className={`h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                      form.color === c ? 'border-gray-900 scale-110' : 'border-white shadow-md'
                    }`}
                    style={{ backgroundColor: c }}
                    aria-label={`Couleur ${c}`}
                  />
                ))}
              </div>
              <input
                type="color"
                className="mt-3 h-10 w-full cursor-pointer rounded-xl border border-gray-200"
                value={form.color}
                onChange={(e) => setForm({ ...form, color: e.target.value })}
              />
            </div>

            {error && <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}
            {success && <p className="rounded-xl bg-green-50 px-4 py-2 text-sm text-green-700">{success}</p>}

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? 'Ajout en cours...' : 'Ajouter la catégorie'}
            </button>
          </form>
        </div>
      </div>

      <div className="lg:col-span-3">
        <h2 className="mb-4 font-display text-xl font-bold text-gray-900">
          Toutes les catégories ({categories.length})
        </h2>

        {categories.length === 0 ? (
          <div className="glass-card py-16 text-center">
            <span className="text-4xl">🏷️</span>
            <p className="mt-3 text-gray-600">Aucune catégorie pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="glass-card overflow-hidden"
                style={{
                  borderLeft: `4px solid ${category.color}`,
                }}
              >
                <div
                  className="p-4"
                  style={{
                    background: `linear-gradient(135deg, ${category.color}18, transparent)`,
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-xs text-gray-500">/{category.id}</p>
                        {category.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-600">{category.description}</p>
                        )}
                        <p className="mt-2 text-xs font-medium text-gray-500">
                          {category.product_count || 0} produit{(category.product_count || 0) !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(category)}
                      className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
