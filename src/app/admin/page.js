'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import NavHeader from '@/components/NavHeader';

// ─── Toast Notification ────────────────────────────────────────────────────────
function Toast({ message, type, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className={`alert-toast ${type}`} role="alert">
      <span>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1.1rem' }}>×</button>
    </div>
  );
}

// ─── Confirm Dialog ────────────────────────────────────────────────────────────
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem',
    }}>
      <div className="glass-card" style={{ maxWidth: '420px', width: '100%', textAlign: 'center' }}>
        <p style={{ marginBottom: '1.5rem', fontSize: '1rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
          <button className="btn btn-danger" onClick={onConfirm}>Excluir</button>
        </div>
      </div>
    </div>
  );
}

// ─── SVG Icons ─────────────────────────────────────────────────────────────────
const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Z" />
  </svg>
);
const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
  </svg>
);
const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
  </svg>
);

// ─── Dynamic String Vector Field (acronyms, synonyms, etc.) ───────────────────
function VectorField({ label, values, onChange }) {
  function add() { onChange([...values, '']); }
  function remove(i) { onChange(values.filter((_, idx) => idx !== i)); }
  function update(i, v) { const arr = [...values]; arr[i] = v; onChange(arr); }

  return (
    <div className="form-group form-full-width">
      <label className="form-label">{label}</label>
      <div className="dynamic-vector-container">
        {values.map((v, i) => (
          <div key={i} className="dynamic-vector-row">
            <input className="form-control" value={v} onChange={e => update(i, e.target.value)} placeholder={`${label} ${i + 1}`} />
            <button type="button" className="btn btn-danger" onClick={() => remove(i)} style={{ padding: '0.65rem 0.75rem' }}>×</button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={add} style={{ width: 'fit-content', fontSize: '0.85rem' }}>
          <PlusIcon /> Adicionar
        </button>
      </div>
    </div>
  );
}

// ─── Object Vector Field (aplicacoes, politicas) ──────────────────────────────
function ObjVectorField({ label, values, onChange, field1, field2 }) {
  function add() { onChange([...values, { [field1]: '', [field2]: '' }]); }
  function remove(i) { onChange(values.filter((_, idx) => idx !== i)); }
  function update(i, key, v) { const arr = [...values]; arr[i] = { ...arr[i], [key]: v }; onChange(arr); }

  return (
    <div className="form-group form-full-width">
      <label className="form-label">{label}</label>
      <div className="dynamic-vector-container">
        {values.map((item, i) => (
          <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input className="form-control" value={item[field1]} onChange={e => update(i, field1, e.target.value)} placeholder={field1} style={{ flex: 1 }} />
              <button type="button" className="btn btn-danger" onClick={() => remove(i)} style={{ padding: '0.65rem 0.75rem' }}>×</button>
            </div>
            <input className="form-control" value={item[field2]} onChange={e => update(i, field2, e.target.value)} placeholder={field2} />
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={add} style={{ width: 'fit-content', fontSize: '0.85rem' }}>
          <PlusIcon /> Adicionar
        </button>
      </div>
    </div>
  );
}

// ─── Termo Form ────────────────────────────────────────────────────────────────
function TermoForm({ termo, statusList, colaboradores, tagsAll, termosAll, onSave, onCancel }) {
  const empty = {
    termo: '', definicao: '', origem_definicao: '',
    status_id: '', owner_id: '', steward_id: '',
    tags: [], termos_relacionados: [],
    aplicacoes: [], acronimos: [], sinonimos: [],
    politicas: [], regras_de_calculo: [], exemplos: [], anotacoes: [],
  };

  const [form, setForm] = useState(termo ? {
    ...termo,
    status_id: termo.status_id?._id || termo.status_id || '',
    owner_id: termo.owner_id?._id || termo.owner_id || '',
    steward_id: termo.steward_id?._id || termo.steward_id || '',
    tags: (termo.tags || []).map(t => t._id || t),
    termos_relacionados: (termo.termos_relacionados || []).map(t => t._id || t),
  } : empty);

  function set(field, value) { setForm(f => ({ ...f, [field]: value })); }

  function toggleMulti(field, id) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(id)
        ? f[field].filter(x => x !== id)
        : [...f[field], id],
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    onSave(form);
  }

  const isEditing = !!termo;

  return (
    <form onSubmit={handleSubmit} id="termo-form">
      <div className="form-grid">
        {/* Dados Principais */}
        <div className="form-group form-full-width">
          <label className="form-label">Termo *</label>
          <input id="f-termo" className="form-control" value={form.termo} onChange={e => set('termo', e.target.value)} required />
        </div>
        <div className="form-group form-full-width">
          <label className="form-label">Definição *</label>
          <textarea id="f-definicao" className="form-control" value={form.definicao} onChange={e => set('definicao', e.target.value)} required />
        </div>
        <div className="form-group form-full-width">
          <label className="form-label">Origem da Definição</label>
          <input id="f-origem" className="form-control" value={form.origem_definicao} onChange={e => set('origem_definicao', e.target.value)} />
        </div>

        {/* Governança */}
        <div className="form-group">
          <label className="form-label">Status *</label>
          <select id="f-status" className="form-control filter-select" value={form.status_id} onChange={e => set('status_id', e.target.value)} required style={{ width: '100%' }}>
            <option value="">Selecione…</option>
            {statusList.map(s => <option key={s._id} value={s._id}>{s.status}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Dono (Owner) *</label>
          <select id="f-owner" className="form-control filter-select" value={form.owner_id} onChange={e => set('owner_id', e.target.value)} required style={{ width: '100%' }}>
            <option value="">Selecione…</option>
            {colaboradores.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Guardião (Steward) *</label>
          <select id="f-steward" className="form-control filter-select" value={form.steward_id} onChange={e => set('steward_id', e.target.value)} required style={{ width: '100%' }}>
            <option value="">Selecione…</option>
            {colaboradores.map(c => <option key={c._id} value={c._id}>{c.nome}</option>)}
          </select>
        </div>

        {/* Tags */}
        <div className="form-group form-full-width">
          <label className="form-label">Tags</label>
          <div className="tag-checkbox-grid">
            {tagsAll.map(t => (
              <label key={t._id} className="tag-checkbox-label">
                <input type="checkbox" checked={form.tags.includes(t._id)} onChange={() => toggleMulti('tags', t._id)} />
                {t.tag}
              </label>
            ))}
          </div>
        </div>

        {/* Termos Relacionados */}
        {termosAll.filter(t => t._id !== form._id).length > 0 && (
          <div className="form-group form-full-width">
            <label className="form-label">Termos Relacionados</label>
            <div className="tag-checkbox-grid" style={{ maxHeight: '200px' }}>
              {termosAll.filter(t => t._id !== form._id).map(t => (
                <label key={t._id} className="tag-checkbox-label">
                  <input type="checkbox" checked={form.termos_relacionados.includes(t._id)} onChange={() => toggleMulti('termos_relacionados', t._id)} />
                  {t.termo}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Vectors */}
        <VectorField label="Acrônimos" values={form.acronimos} onChange={v => set('acronimos', v)} />
        <VectorField label="Sinônimos" values={form.sinonimos} onChange={v => set('sinonimos', v)} />
        <VectorField label="Regras de Cálculo" values={form.regras_de_calculo} onChange={v => set('regras_de_calculo', v)} />
        <VectorField label="Exemplos" values={form.exemplos} onChange={v => set('exemplos', v)} />
        <VectorField label="Anotações" values={form.anotacoes} onChange={v => set('anotacoes', v)} />
        <ObjVectorField label="Aplicações" values={form.aplicacoes} onChange={v => set('aplicacoes', v)} field1="aplicacao" field2="descricao" />
        <ObjVectorField label="Políticas" values={form.politicas} onChange={v => set('politicas', v)} field1="politica" field2="descricao" />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn btn-primary">{isEditing ? 'Salvar Alterações' : 'Criar Termo'}</button>
      </div>
    </form>
  );
}

// ─── Simple Entity Manager (Status, Tags, Colaboradores) ──────────────────────
function SimpleManager({ title, items, field, apiPath, onToast, onRefresh }) {
  const [newValue, setNewValue] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [confirm, setConfirm] = useState(null);
  const hasDesc = apiPath === '/api/status';

  async function create() {
    if (!newValue.trim()) return;
    const body = { [field]: newValue };
    if (hasDesc) body.descricao = newDesc;
    const res = await fetch(apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      onToast(`${title} criado com sucesso!`, 'success');
      setNewValue(''); setNewDesc('');
      onRefresh();
    } else {
      onToast(data.error || 'Erro ao criar.', 'error');
    }
  }

  async function remove(id) {
    const res = await fetch(`${apiPath}/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      onToast(`${title} excluído.`, 'success');
      onRefresh();
    } else {
      onToast(data.error || 'Erro ao excluir.', 'error');
    }
    setConfirm(null);
  }

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          message={`Excluir "${confirm.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => remove(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Inline Create */}
      <div className="glass-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>Novo {title}</h3>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <input
            className="form-control"
            style={{ flex: 1 }}
            placeholder={`Nome do ${title}`}
            value={newValue}
            onChange={e => setNewValue(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && create()}
          />
          {hasDesc && (
            <input
              className="form-control"
              style={{ flex: 2 }}
              placeholder="Descrição (opcional)"
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
            />
          )}
          <button className="btn btn-primary" onClick={create}>
            <PlusIcon /> Adicionar
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card">
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{title}</th>
                {hasDesc && <th>Descrição</th>}
                <th style={{ width: '80px' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr><td colSpan={hasDesc ? 3 : 2} style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>Nenhum item cadastrado.</td></tr>
              )}
              {items.map(item => (
                <tr key={item._id}>
                  <td style={{ fontWeight: 500 }}>{item[field]}</td>
                  {hasDesc && <td style={{ color: 'var(--text-muted)' }}>{item.descricao || '—'}</td>}
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn delete"
                        title="Excluir"
                        onClick={() => setConfirm({ id: item._id, name: item[field] })}
                      ><TrashIcon /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Termos Tab ────────────────────────────────────────────────────────────────
function TermosTab({ statusList, colaboradores, tagsAll, onToast }) {
  const [termos, setTermos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list'); // 'list' | 'form'
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState(null);

  const fetchTermos = useCallback(() => {
    setLoading(true);
    fetch('/api/termos').then(r => r.json()).then(d => {
      setTermos(d.data || []);
      setLoading(false);
    });
  }, []);

  useEffect(() => { fetchTermos(); }, [fetchTermos]);

  async function save(form) {
    const method = editing ? 'PUT' : 'POST';
    const url = editing ? `/api/termos/${editing._id}` : '/api/termos';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      onToast(editing ? 'Termo atualizado com sucesso!' : 'Termo criado com sucesso!', 'success');
      setView('list');
      setEditing(null);
      fetchTermos();
    } else {
      onToast(data.error || 'Erro ao salvar.', 'error');
    }
  }

  async function remove(id) {
    const res = await fetch(`/api/termos/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      onToast('Termo excluído.', 'success');
      fetchTermos();
    } else {
      onToast(data.error || 'Erro ao excluir.', 'error');
    }
    setConfirm(null);
  }

  if (view === 'form') {
    return (
      <div className="glass-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">{editing ? 'Editar Termo' : 'Novo Termo'}</h2>
        </div>
        <TermoForm
          termo={editing}
          statusList={statusList}
          colaboradores={colaboradores}
          tagsAll={tagsAll}
          termosAll={termos}
          onSave={save}
          onCancel={() => { setView('list'); setEditing(null); }}
        />
      </div>
    );
  }

  return (
    <div>
      {confirm && (
        <ConfirmDialog
          message={`Excluir o termo "${confirm.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={() => remove(confirm.id)}
          onCancel={() => setConfirm(null)}
        />
      )}
      <div className="glass-card">
        <div className="admin-card-header">
          <h2 className="admin-card-title">Termos</h2>
          <button className="btn btn-primary" onClick={() => { setEditing(null); setView('form'); }}>
            <PlusIcon /> Novo Termo
          </button>
        </div>
        {loading ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem' }}>Carregando…</p>
        ) : (
          <div className="table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Termo</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th style={{ width: '100px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {termos.length === 0 && (
                  <tr><td colSpan={4} style={{ color: 'var(--text-dim)', textAlign: 'center', padding: '2rem' }}>Nenhum termo cadastrado.</td></tr>
                )}
                {termos.map(t => (
                  <tr key={t._id}>
                    <td style={{ fontWeight: 600 }}>{t.termo}</td>
                    <td>
                      {t.status_id ? (
                        <span className={`badge-status ${(t.status_id.status || '').toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`}>
                          {t.status_id.status}
                        </span>
                      ) : '—'}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{t.owner_id?.nome || '—'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="icon-btn edit"
                          title="Editar"
                          onClick={() => { setEditing(t); setView('form'); }}
                        ><PencilIcon /></button>
                        <button
                          className="icon-btn delete"
                          title="Excluir"
                          onClick={() => setConfirm({ id: t._id, name: t.termo })}
                        ><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Admin Page ───────────────────────────────────────────────────────────
export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('termos');
  const [toast, setToast] = useState(null);

  // Shared data
  const [statusList, setStatusList] = useState([]);
  const [colaboradores, setColaboradores] = useState([]);
  const [tagsAll, setTagsAll] = useState([]);

  function showToast(message, type = 'success') {
    setToast({ message, type });
  }

  const fetchStatus = () => fetch('/api/status').then(r => r.json()).then(d => setStatusList(d.data || []));
  const fetchColabs = () => fetch('/api/colaboradores').then(r => r.json()).then(d => setColaboradores(d.data || []));
  const fetchTags = () => fetch('/api/tags').then(r => r.json()).then(d => setTagsAll(d.data || []));

  useEffect(() => {
    fetchStatus();
    fetchColabs();
    fetchTags();
  }, []);

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
    router.refresh();
  }

  const tabs = [
    { id: 'termos', label: 'Termos', icon: '📚' },
    { id: 'colaboradores', label: 'Colaboradores', icon: '👤' },
    { id: 'status', label: 'Status', icon: '🔖' },
    { id: 'tags', label: 'Tags', icon: '🏷️' },
  ];

  return (
    <>
      <NavHeader />
      <main className="app-container">
        {/* Page Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Painel Administrativo</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Gerencie termos, colaboradores, status e tags do glossário.
            </p>
          </div>
          <button className="btn btn-secondary" onClick={handleLogout} style={{ fontSize: '0.85rem' }}>
            Sair da sessão
          </button>
        </div>

        {/* Admin Layout */}
        <div className="admin-layout">
          {/* Sidebar Tabs */}
          <aside className="admin-sidebar">
            <div className="glass-card" style={{ padding: '0.75rem' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  id={`admin-tab-${tab.id}`}
                  className={`admin-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Quick seed button */}
            <div className="glass-card" style={{ padding: '1rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
                Popularo banco com dados de exemplo para teste.
              </p>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.82rem', width: '100%', justifyContent: 'center' }}
                onClick={async () => {
                  const res = await fetch('/api/seed');
                  const d = await res.json();
                  if (d.success) {
                    showToast('Banco populado com dados de exemplo!', 'success');
                    fetchStatus(); fetchColabs(); fetchTags();
                  } else {
                    showToast(d.error || 'Erro ao popular banco.', 'error');
                  }
                }}
              >
                🌱 Popular Dados de Exemplo
              </button>
            </div>
          </aside>

          {/* Tab Content */}
          <div>
            {activeTab === 'termos' && (
              <TermosTab
                statusList={statusList}
                colaboradores={colaboradores}
                tagsAll={tagsAll}
                onToast={showToast}
              />
            )}
            {activeTab === 'colaboradores' && (
              <SimpleManager
                title="Colaborador"
                items={colaboradores}
                field="nome"
                apiPath="/api/colaboradores"
                onToast={showToast}
                onRefresh={fetchColabs}
              />
            )}
            {activeTab === 'status' && (
              <SimpleManager
                title="Status"
                items={statusList}
                field="status"
                apiPath="/api/status"
                onToast={showToast}
                onRefresh={fetchStatus}
              />
            )}
            {activeTab === 'tags' && (
              <SimpleManager
                title="Tag"
                items={tagsAll}
                field="tag"
                apiPath="/api/tags"
                onToast={showToast}
                onRefresh={fetchTags}
              />
            )}
          </div>
        </div>
      </main>

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}
    </>
  );
}
