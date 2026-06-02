import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCategories, fetchProductsByCategory } from '../api';
import ProductCard from '../components/ProductCard';
import { usePageMeta } from '../usePageMeta';

export default function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  usePageMeta(
    category
      ? {
          title: `${category.name} — Soeurs Finds | Boutique en ligne Canada`,
          description: `${category.description || category.name}. Découvrez nos produits ${category.name.toLowerCase()} chez Soeurs Finds. Commandez en ligne au Canada.`,
        }
      : {}
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchCategories(), fetchProductsByCategory(id)])
      .then(([categories, prods]) => {
        setCategory(categories.find((c) => c.id === id));
        setProducts(prods);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (!loading && !category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="font-display text-3xl font-bold">Catégorie introuvable</h1>
        <Link to="/" className="btn-primary mt-6 inline-flex">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  return (
    <>
      <section
        className="relative overflow-hidden py-16 sm:py-20"
        style={{
          background: category
            ? `linear-gradient(135deg, ${category.color}15, ${category.color}05)`
            : undefined,
        }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-brand-600"
          >
            ← Retour à l'accueil
          </Link>

          {loading ? (
            <div className="h-20 animate-pulse rounded-2xl bg-gray-200" />
          ) : (
            <div className="flex items-center gap-5 animate-fade-up">
              <span
                className="flex h-16 w-16 items-center justify-center rounded-2xl text-3xl shadow-lg"
                style={{ backgroundColor: `${category.color}22` }}
              >
                {category.icon}
              </span>
              <div>
                <h1 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
                  {category.name}
                </h1>
                <p className="mt-1 text-gray-600">{category.description}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-gray-200" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg text-gray-600">Aucun produit dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard
                key={product.id}
                product={{ ...product, category_name: category.name, category_color: category.color }}
                index={i}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
