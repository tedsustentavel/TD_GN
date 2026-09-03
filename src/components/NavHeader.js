'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function NavHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then((data) => {
        if (data.success) {
          setUser(data.user);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, []);

  function handleLogout() {
    router.push('/api/auth/logout');
  }

  return (
    <nav className="app-container">
      <div className="nav-header">
        <Link href="/" className="nav-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <img src="/logo.svg" alt="Portal de Governança de Dados Logo" style={{ height: '36px', width: '36px', display: 'block' }} />
          <span style={{ fontWeight: 800, color: 'var(--text-main)', background: 'linear-gradient(to right, var(--secondary), var(--primary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Portal de Governança de Dados
          </span>
        </Link>
        <div className="nav-links">
          <Link
            href="/"
            className={`nav-link ${pathname === '/' ? 'active' : ''}`}
          >
            Buscar Termos
          </Link>
          {user?.isAdmin && (
            <Link
              href="/admin"
              className={`nav-link ${pathname.startsWith('/admin') ? 'active' : ''}`}
            >
              Administração
            </Link>
          )}
        </div>
        {user && (
          <div className="nav-user-info" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {user.nome}
              </span>
              {user.isAdmin && (
                <span style={{ fontSize: '0.7rem', color: 'var(--secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Administrador
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{
                fontSize: '0.78rem',
                padding: '0.4rem 0.8rem',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                color: '#f87171',
                background: 'rgba(239, 68, 68, 0.05)',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)';
              }}
            >
              Sair
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
