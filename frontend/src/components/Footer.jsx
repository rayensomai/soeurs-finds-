import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCategories, formatPhoneDisplay } from '../api';
import Logo from './Logo';
import { SocialButtonsRow } from './SocialLinks';

const PHONE = '5146010010';
const ADDRESS = {
  street: '4949 Métropolitaine',
  city: 'Saint-Léonard, QC',
  postal: 'H1R 1Z6',
};

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  return (
    <footer className="mt-20 border-t border-gray-200/60 bg-white/50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Logo className="mb-4 h-24 w-auto" />
            <p className="text-sm leading-relaxed text-gray-600">
              Boutique canadienne — produits sélectionnés pour votre maison, votre bien-être et vos loisirs.
            </p>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Catégories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={`/categorie/${cat.id}`} className="hover:text-brand-600">
                    {cat.icon} {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 font-semibold text-gray-900">Contact</h3>
            <p className="mb-4 text-sm text-gray-600">
              Commandez en ligne — nous vous rappelons pour finaliser votre achat.
            </p>

            <div className="space-y-3 rounded-2xl border border-gray-100 bg-cream/60 p-4">
              <div className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-base">
                  📍
                </span>
                <address className="not-italic text-sm leading-relaxed text-gray-700">
                  <span className="font-medium text-gray-900">{ADDRESS.street}</span>
                  <br />
                  {ADDRESS.city} {ADDRESS.postal}
                  <br />
                  Canada
                </address>
              </div>

              <a
                href={`tel:${PHONE}`}
                className="flex items-center gap-3 rounded-xl p-1 transition-colors hover:bg-white/80"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-base">
                  📞
                </span>
                <span className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                  {formatPhoneDisplay(PHONE)}
                </span>
              </a>
            </div>

            <SocialButtonsRow className="mt-5 !justify-start" />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-2 border-t border-gray-200/60 pt-8 text-center">
          <p className="text-sm font-medium text-gray-700">
            {ADDRESS.street}, {ADDRESS.city} {ADDRESS.postal}
          </p>
          <a
            href={`tel:${PHONE}`}
            className="text-sm font-semibold text-brand-600 transition-colors hover:text-brand-700"
          >
            {formatPhoneDisplay(PHONE)}
          </a>
          <p className="mt-4 text-xs text-gray-500">
            © {new Date().getFullYear()} Soeurs Finds — Canada 🇨🇦 — Tous droits réservés
          </p>
        </div>
      </div>
    </footer>
  );
}
