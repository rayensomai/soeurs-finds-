import { formatPrice } from '../api';

export default function ProductCard({ product, onBuy, index = 0 }) {
  return (
    <article
      className="group glass-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/10"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {product.featured ? (
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
          <span className="font-display text-xl font-bold text-brand-600 sm:text-2xl">
            {formatPrice(product.price)}
          </span>
          <button
            onClick={() => onBuy(product)}
            className="btn-primary !px-5 !py-2.5 !text-xs sm:!px-6 sm:!text-sm"
          >
            Acheter
          </button>
        </div>
      </div>
    </article>
  );
}
