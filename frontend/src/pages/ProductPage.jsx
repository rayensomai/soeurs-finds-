import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  fetchProduct,
  formatPrice,
  getProductImages,
  isProductAvailable,
} from '../api';
import OrderModal from '../components/OrderModal';
import { usePageMeta } from '../usePageMeta';

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showOrder, setShowOrder] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProduct(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const images = product ? getProductImages(product) : [];
  const sold = product ? !isProductAvailable(product) : false;

  usePageMeta(
    product
      ? {
          title: `${product.name} — Soeurs Finds | ${formatPrice(product.price)}`,
          description: product.description || `${product.name} — boutique Soeurs Finds, Canada.`,
        }
      : {}
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-gray-200" />
          <div className="space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Produit introuvable</h1>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <Link
          to={`/categorie/${product.category_id}`}
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600"
        >
          ← Retour à {product.category_name}
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-gray-100 shadow-xl">
              {images.length > 0 ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className={`h-full w-full object-cover ${sold ? 'grayscale-[20%]' : ''}`}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-8xl text-gray-300">📦</div>
              )}
              {sold && (
                <span className="absolute left-5 top-5 rounded-full bg-gray-900 px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
                  Vendu
                </span>
              )}
              {!sold && product.featured ? (
                <span className="absolute left-5 top-5 rounded-full bg-gold px-4 py-2 text-sm font-bold uppercase tracking-wider text-white shadow-lg">
                  Populaire
                </span>
              ) : null}
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      activeImage === i ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-3">
              {product.category_icon && (
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${product.category_color || '#E85D4C'}22` }}
                >
                  {product.category_icon}
                </span>
              )}
              <Link
                to={`/categorie/${product.category_id}`}
                className="text-sm font-semibold uppercase tracking-wider hover:underline"
                style={{ color: product.category_color || '#E85D4C' }}
              >
                {product.category_name}
              </Link>
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              {product.name}
            </h1>

            <p className={`mt-4 font-display text-3xl font-bold ${sold ? 'text-gray-500 line-through' : 'text-brand-600'}`}>
              {formatPrice(product.price)}
            </p>

            {sold && (
              <p className="mt-2 inline-flex w-fit rounded-full bg-gray-100 px-4 py-1.5 text-sm font-semibold text-gray-700">
                Ce produit a déjà été vendu
              </p>
            )}

            <div className="mt-8">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Description
              </h2>
              <p className="mt-3 text-base leading-relaxed text-gray-700 whitespace-pre-line">
                {product.description || 'Aucune description disponible.'}
              </p>
            </div>

            <div className="mt-8 rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">
                Caractéristiques
              </h2>
              <dl className="mt-4 space-y-3">
                <div className="flex justify-between gap-4 border-b border-gray-200 pb-3">
                  <dt className="text-gray-600">Catégorie</dt>
                  <dd className="font-medium text-gray-900">{product.category_name}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-200 pb-3">
                  <dt className="text-gray-600">Prix</dt>
                  <dd className="font-medium text-gray-900">{formatPrice(product.price)}</dd>
                </div>
                <div className="flex justify-between gap-4 border-b border-gray-200 pb-3">
                  <dt className="text-gray-600">Statut</dt>
                  <dd className={`font-semibold ${sold ? 'text-gray-700' : 'text-green-700'}`}>
                    {sold ? 'Vendu' : 'Disponible'}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-gray-600">Livraison</dt>
                  <dd className="font-medium text-gray-900">Partout au Canada</dd>
                </div>
              </dl>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              {sold ? (
                <Link
                  to={`/categorie/${product.category_id}`}
                  className="btn-primary inline-flex"
                >
                  Voir d'autres produits
                </Link>
              ) : (
                <button type="button" onClick={() => setShowOrder(true)} className="btn-primary">
                  Acheter — nous vous rappelons
                </button>
              )}
              <Link
                to={`/categorie/${product.category_id}`}
                className="inline-flex items-center rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                Autres {product.category_name.toLowerCase()}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {showOrder && !sold && (
        <OrderModal product={product} onClose={() => setShowOrder(false)} />
      )}
    </>
  );
}
