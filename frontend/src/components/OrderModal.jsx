import { useState } from 'react';
import { createOrder, formatPrice, getProductMainImage } from '../api';

export default function OrderModal({ product, onClose }) {
  const [form, setForm] = useState({ prenom: '', nom: '', telephone: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  const mainImage = getProductMainImage(product);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createOrder({
        product_id: product.id,
        ...form,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md animate-fade-up rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
          aria-label="Fermer"
        >
          ✕
        </button>

        {success ? (
          <div className="py-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✅
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900">
              Merci {form.prenom} !
            </h2>
            <p className="mt-3 text-gray-600">
              Votre demande a été reçue. Nous vous appellerons très bientôt au{' '}
              <strong>{form.telephone}</strong> pour finaliser votre commande.
            </p>
            <button onClick={onClose} className="btn-primary mt-8">
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex items-center gap-4">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={product.name}
                  className="h-16 w-16 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-2xl">📦</div>
              )}
              <div>
                <h2 className="font-display text-xl font-bold text-gray-900">
                  Commander
                </h2>
                <p className="text-sm text-gray-600">{product.name}</p>
                <p className="font-semibold text-brand-600">{formatPrice(product.price)}</p>
              </div>
            </div>

            <p className="mb-6 rounded-2xl bg-brand-50 px-4 py-3 text-sm text-brand-800">
              📞 Remplissez vos coordonnées et nous vous rappelons pour confirmer votre achat.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Prénom *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Votre prénom"
                  value={form.prenom}
                  onChange={(e) => setForm({ ...form, prenom: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nom *
                </label>
                <input
                  type="text"
                  required
                  className="input-field"
                  placeholder="Votre nom"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  required
                  className="input-field"
                  placeholder="Ex: (514) 555-1234"
                  value={form.telephone}
                  onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                />
              </div>

              {error && (
                <p className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Envoi en cours...' : 'Confirmer ma commande'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
