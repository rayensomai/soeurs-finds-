import { Link } from 'react-router-dom';
import { formatPrice, getProductMainImage, isProductAvailable } from '../api';

export default function ProductCard({ product, index = 0 }) {
  const mainImage = getProductMainImage(product);
  const sold = !isProductAvailable(product);

  return (
    <article
      className={`group glass-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10 ${
        sold ? 'opacity-90' : ''
      }`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <Link to={`/produit/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {mainImage ? (
            <img
              src={mainImage}
              alt={product.name}
              className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${
                sold ? 'grayscale-[30%]' : ''
              }`}
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl text-gray-300">📦</div>
          )}
          {sold && (
            <span className="absolute left-4 top-4 rounded-full bg-gray-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Vendu
            </span>
          )}
          {!sold && product.featured ? (
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
              Populaire
            </span>
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>

        <div className="p-5 sm:p-6">
          {product.category_name && (
            <span
              className="mb-2 inline-block text-xs font-semibold uppercase tracking-wider"
              style={{ color: product.category_color || '#E85D4C' }}
            >
              {product.category_name}
            </span>
          )}
          <h3 className="font-display text-lg font-semibold text-gray-900 sm:text-xl">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {product.description}
          </p>
          <div className="mt-5 flex items-center justify-between gap-3">
            <span className={`font-display text-xl font-bold sm:text-2xl ${sold ? 'text-gray-500' : 'text-brand-600'}`}>
              {formatPrice(product.price)}
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 transition-colors group-hover:border-brand-300 group-hover:text-brand-600 sm:text-sm">
              Voir détails →
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
