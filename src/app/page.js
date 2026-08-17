'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import NavHeader from '@/components/NavHeader';

// ─── SVG Icons ───────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg className="search-icon-svg" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  );
}

function EmptyStateIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Zm3.75 11.625a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  if (!status) return null;
  const name = status.status || '';
  const slug = name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return <span className={`badge-status ${slug}`}>{name}</span>;
}

// ─── Term Card ────────────────────────────────────────────────────────────────
function TermCard({ termo }) {
  return (
    <Link href={`/termos/${termo._id}`}>
      <article className="glass-card term-card">
        <div>
          <div className="term-card-header">
            <h2 className="term-card-title">{termo.termo}</h2>
            <StatusBadge status={termo.status_id} />
          </div>
          <p className="term-card-desc">{termo.definicao}</p>
          {termo.tags && termo.tags.length > 0 && (
            <div className="term-tags-container" style={{ marginBottom: '0.75rem' }}>
              {termo.tags.map((tag) => (
                <span key={tag._id} className="tag-pill">#{tag.tag}</span>
              ))}
            </div>
          )}
        </div>
        <div className="term-card-metadata">
          <span className="term-card-owner">
            <UserIcon />
            {termo.owner_id?.nome || '—'}
          </span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
            {termo.acronimos?.length > 0 && `${termo.acronimos[0]}`}
          </span>
        </div>
      </article>
    </Link>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [termos, setTermos] = useState([]);
  const [statusList, setStatusList] = useState([]);
  const [tagsList, setTagsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');

  // Fetch filters (status + tags)
  useEffect(() => {
    fetch('/api/status').then(r => r.json()).then(d => setStatusList(d.data || []));
    fetch('/api/tags').then(r => r.json()).then(d => setTagsList(d.data || []));
  }, []);

  // Debounced fetch
  const fetchTermos = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (statusFilter) params.set('status', statusFilter);
    if (tagFilter) params.set('tag', tagFilter);

    fetch(`/api/termos?${params.toString()}`)
      .then(r => r.json())
      .then(d => { setTermos(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [query, statusFilter, tagFilter]);

  useEffect(() => {
    const timer = setTimeout(fetchTermos, 300);
    return () => clearTimeout(timer);
  }, [fetchTermos]);

  const hasFilters = query || statusFilter || tagFilter;

  return (
    <>
      <NavHeader />
      <main className="app-container">
        {/* Hero */}
        <section className="search-hero">
          <h1>Glossário de Negócios</h1>
          <p>Encontre definições, métricas e termos corporativos de forma rápida e precisa.</p>
        </section>

        {/* Search & Filters */}
        <div className="search-controls">
          <div className="search-bar-container">
            <SearchIcon />
            <input
              id="search-input"
              type="search"
              className="search-input"
              placeholder="Busque por termo, acrônimo, sinônimo ou definição…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="filter-row">
            <span className="filter-label">Filtrar por:</span>

            <select
              id="filter-status"
              className="filter-select"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option value="">Todos os Status</option>
              {statusList.map(s => (
                <option key={s._id} value={s._id}>{s.status}</option>
              ))}
            </select>

            <select
              id="filter-tag"
              className="filter-select"
              value={tagFilter}
              onChange={e => setTagFilter(e.target.value)}
            >
              <option value="">Todas as Tags</option>
              {tagsList.map(t => (
                <option key={t._id} value={t._id}>{t.tag}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                className="btn btn-secondary"
                onClick={() => { setQuery(''); setStatusFilter(''); setTagFilter(''); }}
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
            Carregando termos…
          </div>
        ) : termos.length === 0 ? (
          <div className="no-results">
            <EmptyStateIcon />
            <h3>Nenhum termo encontrado</h3>
            <p>Tente alterar os filtros ou busque por outro termo.</p>
          </div>
        ) : (
          <>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              {termos.length} {termos.length === 1 ? 'termo encontrado' : 'termos encontrados'}
            </p>
            <div className="terms-grid">
              {termos.map(t => <TermCard key={t._id} termo={t} />)}
            </div>
          </>
        )}
      </main>
    </>
  );
}
