import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, fetchFeaturedProducts } from '../api';
import ProductCard from '../components/ProductCard';
import { SocialButtonsRow } from '../components/SocialLinks';
import { usePageMeta } from '../usePageMeta';

export default function HomePage() {
  usePageMeta({
    title: 'Soeurs Finds — Boutique en ligne Canada | Vos trouvailles, notre passion',
    description:
      'Soeurs Finds — boutique en ligne au Canada. Cuisine, bien-être, lumière, sport, technologie et jardinage. Commandez en ligne, livraison partout au Canada.',
  });

  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchCategories(), fetchFeaturedProducts()])
      .then(([cats, products]) => {
        setCategories(cats);
        setFeatured(products);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-100/80 via-cream to-gold/10" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-brand-700 shadow-sm backdrop-blur animate-fade-up">
              ✨ Nouvelle collection disponible
            </span>
            <h1 className="animate-fade-up font-display text-4xl font-bold leading-tight text-gray-900 sm:text-5xl lg:text-6xl" style={{ animationDelay: '100ms' }}>
              Trouvez le produit parfait pour{' '}
              <span className="bg-gradient-to-r from-brand-500 to-gold bg-clip-text text-transparent">
                votre quotidien
              </span>
            </h1>
            <p className="mt-6 animate-fade-up text-lg leading-relaxed text-gray-600 sm:text-xl" style={{ animationDelay: '200ms' }}>
              Cuisine, bien-être, lumière, sport, technologie et jardinage — une sélection soignée partout au Canada.
              Cliquez sur Acheter et nous vous rappelons !
            </p>
            <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-4 sm:flex-row" style={{ animationDelay: '300ms' }}>
              <a href="#categories" className="btn-primary">
                Explorer les catégories
              </a>
              <SocialButtonsRow />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
            Nos catégories
          </h2>
          <p className="mt-3 text-gray-600">Choisissez votre univers et découvrez nos produits</p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-48 animate-pulse rounded-3xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/categorie/${cat.id}`}
                className="group relative overflow-hidden rounded-3xl p-8 text-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl animate-fade-up"
                style={{
                  background: `linear-gradient(135deg, ${cat.color}ee, ${cat.color}99)`,
                  animationDelay: `${i * 100}ms`,
                }}
              >
                <div className="absolute -right-4 -top-4 text-8xl opacity-20 transition-transform duration-500 group-hover:scale-125 group-hover:rotate-12">
                  {cat.icon}
                </div>
                <span className="text-4xl">{cat.icon}</span>
                <h3 className="mt-4 font-display text-2xl font-bold">{cat.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/90">{cat.description}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold opacity-0 transition-all duration-300 group-hover:opacity-100">
                  Voir les produits →
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products */}
      <section className="bg-gradient-to-b from-white/50 to-cream py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-gray-900 sm:text-4xl">
              Nos coups de cœur
            </h2>
            <p className="mt-3 text-gray-600">Les produits les plus demandés par nos clients</p>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-3xl bg-gray-200" />
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product, i) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-brand-500 via-brand-600 to-brand-700 p-10 text-center text-white shadow-2xl shadow-brand-500/30 sm:p-16">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
          <div className="relative">
            <h2 className="font-display text-3xl font-bold sm:text-4xl">
              Prêt à commander ?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
              Choisissez votre produit, remplissez vos coordonnées et nous vous appelons pour finaliser votre achat en toute simplicité.
            </p>
            <a href="#categories" className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-brand-600 shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl">
              Commencer mes achats
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
