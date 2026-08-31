'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import NavHeader from '@/components/NavHeader';

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function BackIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
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

// ─── Section Block ────────────────────────────────────────────────────────────
function SectionBlock({ title, children, icon }) {
  return (
    <div className="glass-card">
      <h3 className="section-title">{icon && <span>{icon}</span>}{title}</h3>
      {children}
    </div>
  );
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────
function SkeletonBlock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[200, 400, 300, 350, 280].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? '2.5rem' : '1rem',
          width: `${w}px`,
          maxWidth: '100%',
          background: 'rgba(255,255,255,0.04)',
          borderRadius: '6px',
          animation: 'pulse 1.5s ease-in-out infinite',
        }} />
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TermoDetailPage() {
  const { id } = useParams();
  const [termo, setTermo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/termos/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setTermo(d.data);
        else setError(d.error || 'Termo não encontrado.');
        setLoading(false);
      })
      .catch(() => { setError('Erro ao carregar o termo.'); setLoading(false); });
  }, [id]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleApprove = async () => {
    if (!confirm('Deseja realmente aprovar este termo?')) return;
    try {
      const res = await fetch(`/api/termos/${id}/aprovar`, {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setTermo(data.data);
        alert('Termo aprovado e publicado com sucesso!');
      } else {
        alert(data.error || 'Erro ao aprovar o termo.');
      }
    } catch (err) {
      alert('Erro de conexão ao tentar aprovar o termo.');
    }
  };

  const hasSynonyms = termo?.sinonimos?.length > 0;
  const hasAcronyms = termo?.acronimos?.length > 0;
  const hasApps = termo?.aplicacoes?.length > 0;
  const hasPolicies = termo?.politicas?.length > 0;
  const hasRules = termo?.regras_de_calculo?.length > 0;
  const hasExamples = termo?.exemplos?.length > 0;
  const hasNotes = termo?.anotacoes?.length > 0;
  const hasRelated = termo?.termos_relacionados?.length > 0;
  const hasTags = termo?.tags?.length > 0;

  const isPendingApproval = termo?.status_id?.status === 'Em aprovação';
  const isOwner = currentUser && termo?.owner_id && (currentUser.id === (termo.owner_id._id || termo.owner_id));
  const isAdmin = currentUser?.isAdmin;
  const canApprove = isPendingApproval && (isOwner || isAdmin);

  return (
    <>
      <NavHeader />
      <main className="app-container" style={{ paddingBottom: '5rem' }}>
        <Link href="/" className="back-link">
          <BackIcon /> Voltar ao Glossário
        </Link>

        {loading && (
          <div className="glass-card">
            <SkeletonBlock />
          </div>
        )}

        {error && (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
            <p style={{ color: 'var(--text-muted)' }}>{error}</p>
            <Link href="/" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
              Voltar ao início
            </Link>
          </div>
        )}

        {termo && (
          <>
            {/* ── Header Card ─────────────────────────────────────────── */}
            <div className="glass-card detail-header-card">
              <div className="detail-title-row">
                <h1 className="detail-title">{termo.termo}</h1>
                <StatusBadge status={termo.status_id} />
              </div>

              <p className="detail-desc">{termo.definicao}</p>

              <div className="detail-meta-grid">
                {termo.origem_definicao && (
                  <div className="meta-item">
                    <span className="meta-label">Origem da Definição</span>
                    <span className="meta-value">{termo.origem_definicao}</span>
                  </div>
                )}
                <div className="meta-item">
                  <span className="meta-label">Dono (Owner)</span>
                  <span className="meta-value">{termo.owner_id?.nome || '—'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Guardião (Steward)</span>
                  <span className="meta-value">{termo.steward_id?.nome || '—'}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Atualizado em</span>
                  <span className="meta-value">
                    {termo.atualizado_em
                      ? new Date(termo.atualizado_em).toLocaleDateString('pt-BR')
                      : '—'}
                  </span>
                </div>
              </div>

              {canApprove && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Este termo está pendente de aprovação. Como {currentUser?.isAdmin ? 'administrador' : 'proprietário (owner)'}, você pode aprová-lo para publicação:
                  </span>
                  <button onClick={handleApprove} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    Aprovar Termo
                  </button>
                </div>
              )}
            </div>

            {/* ── Two-column layout ──────────────────────────────────── */}
            <div className="detail-layout">
              {/* Left Column — Main Content */}
              <div className="detail-content-blocks">
                {hasRules && (
                  <SectionBlock title="Regras de Cálculo" icon="∑">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {termo.regras_de_calculo.map((r, i) => (
                        <div key={i} className="formula-box">{r}</div>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                {hasApps && (
                  <SectionBlock title="Aplicações" icon="⬡">
                    <div className="list-group">
                      {termo.aplicacoes.map((a, i) => (
                        <div key={i} className="list-item-card">
                          <div className="list-item-title">{a.aplicacao}</div>
                          {a.descricao && <div className="list-item-desc">{a.descricao}</div>}
                        </div>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                {hasPolicies && (
                  <SectionBlock title="Políticas" icon="⚖">
                    <div className="list-group">
                      {termo.politicas.map((p, i) => (
                        <div key={i} className="list-item-card">
                          <div className="list-item-title">{p.politica}</div>
                          {p.descricao && <div className="list-item-desc">{p.descricao}</div>}
                        </div>
                      ))}
                    </div>
                  </SectionBlock>
                )}

                {hasExamples && (
                  <SectionBlock title="Exemplos Práticos" icon="📋">
                    <ul className="bullet-list">
                      {termo.exemplos.map((e, i) => <li key={i}>{e}</li>)}
                    </ul>
                  </SectionBlock>
                )}

                {hasNotes && (
                  <SectionBlock title="Anotações" icon="📝">
                    <ul className="bullet-list">
                      {termo.anotacoes.map((n, i) => <li key={i}>{n}</li>)}
                    </ul>
                  </SectionBlock>
                )}
              </div>

              {/* Right Sidebar */}
              <div className="sidebar-blocks">
                {(hasAcronyms || hasSynonyms) && (
                  <div className="glass-card">
                    {hasAcronyms && (
                      <>
                        <h3 className="sidebar-title">Acrônimos</h3>
                        <div className="pill-group" style={{ marginBottom: hasSynonyms ? '1.5rem' : 0 }}>
                          {termo.acronimos.map((a, i) => (
                            <span key={i} className="large-pill" style={{ color: 'var(--secondary)', borderColor: 'rgba(6,182,212,0.2)' }}>{a}</span>
                          ))}
                        </div>
                      </>
                    )}
                    {hasSynonyms && (
                      <>
                        <h3 className="sidebar-title">Sinônimos</h3>
                        <div className="pill-group">
                          {termo.sinonimos.map((s, i) => (
                            <span key={i} className="large-pill">{s}</span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {hasTags && (
                  <div className="glass-card">
                    <h3 className="sidebar-title">Tags</h3>
                    <div className="pill-group">
                      {termo.tags.map((t) => (
                        <Link key={t._id} href={`/?tag=${t._id}`} className="large-pill" style={{ cursor: 'pointer' }}>
                          #{t.tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {hasRelated && (
                  <div className="glass-card">
                    <h3 className="sidebar-title">Termos Relacionados</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {termo.termos_relacionados.map((t) => (
                        <Link key={t._id} href={`/termos/${t._id}`} className="related-term-link">
                          <span>{t.termo}</span>
                          <ArrowRightIcon />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </>
  );
}
