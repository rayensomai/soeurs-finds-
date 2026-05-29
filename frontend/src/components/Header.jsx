import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

export default function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-cream/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group transition-transform hover:scale-[1.02]">
          <Logo className="h-12 w-auto sm:h-14" />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'bg-brand-100 text-brand-700'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            Accueil
          </Link>
          <a
            href="https://www.facebook.com/profile.php?id=61560521294412"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#1877F2] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Facebook
          </a>
          <Link
            to="/admin"
            className="rounded-full px-4 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}
