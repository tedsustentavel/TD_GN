'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavHeader() {
  const pathname = usePathname();

  return (
    <nav className="app-container">
      <div className="nav-header">
        <Link href="/" className="nav-brand">
          GN<span>Glossário de Negócios</span>
        </Link>
        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Buscar Termos
          </Link>
          <Link
            href="/admin"
            className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
          >
            Administração
          </Link>
        </div>
      </div>
    </nav>
  );
}
