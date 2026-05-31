import { Link } from 'react-router-dom';
import { formatPhoneDisplay } from '../api';
import Logo from './Logo';

const PHONE = '5146010010';
const ADDRESS = {
  street: '4949 Métropolitaine',
  city: 'Saint-Léonard, QC',
  postal: 'H1R 1Z6',
};

export default function Footer() {
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
              <li><Link to="/categorie/cuisine" className="hover:text-brand-600">Cuisine</Link></li>
              <li><Link to="/categorie/bien-etre" className="hover:text-brand-600">Bien-être</Link></li>
              <li><Link to="/categorie/lumiere" className="hover:text-brand-600">Lumière</Link></li>
              <li><Link to="/categorie/sport-divertissement" className="hover:text-brand-600">Sport & Divertissement</Link></li>
              <li><Link to="/categorie/technologie" className="hover:text-brand-600">Technologie</Link></li>
              <li><Link to="/categorie/jardinage" className="hover:text-brand-600">Jardinage</Link></li>
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

            <a
              href="https://www.facebook.com/profile.php?id=61560521294412"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#1877F2] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Suivez-nous sur Facebook
            </a>
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
