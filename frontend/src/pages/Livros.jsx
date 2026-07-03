import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Livros() {
  const [livros, setLivros] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);

  const [filtros, setFiltros] = useState({ titulo: '', autor: '', categoria: '', status: '', isbn: '' });
  
  const [formLivro, setFormLivro] = useState({
    titulo: '', autor: '', editora: '', ano_publicacao: '', categoria: '', isbn: '', quantidade_total: '', quantidade_disponivel: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const podeGerenciar = user?.tipo === 'Administrador' || user?.tipo === 'Bibliotecário';
  const podeExcluir = user?.tipo === 'Administrador';

  useEffect(() => { carregarLivros(); }, []);

  const carregarLivros = async () => {
    try {
      const resposta = await api.get('/livros');
      setLivros(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar livros", error);
    }
  };

  const buscarLivros = async () => {
    try {
      const resposta = await api.get('/livros/buscar', { params: filtros });
      setLivros(resposta.data);
    } catch (error) {
      alert("Erro ao buscar livros");
    }
  };

  const limparFiltros = () => {
    setFiltros({ titulo: '', autor: '', categoria: '', status: '', isbn: '' });
    carregarLivros();
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/livros/${editandoId}`, formLivro);
        alert('Livro atualizado com sucesso!');
      } else {
        await api.post('/livros', formLivro);
        alert('Livro cadastrado com sucesso!');
      }
      setMostrarForm(false);
      setEditandoId(null);
      setFormLivro({ titulo: '', autor: '', editora: '', ano_publicacao: '', categoria: '', isbn: '', quantidade_total: '', quantidade_disponivel: '' });
      carregarLivros();
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao salvar livro.');
    }
  };

  const prepararEdicao = (livro) => {
    setFormLivro(livro);
    setEditandoId(livro.id);
    setMostrarForm(true);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este livro?')) {
      await api.delete(`/livros/${id}`);
      carregarLivros();
    }
  };

  return (
    <div className="container mt-4">
      
      {/* Cabeçalho */}
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-secondary">Gerenciamento de Livros</h2>
        {podeGerenciar && (
          <button 
            className={`btn ${mostrarForm ? 'btn-outline-secondary' : 'btn-success'} fw-semibold`}
            onClick={() => { setMostrarForm(!mostrarForm); setEditandoId(null); setFormLivro({ titulo: '', autor: '', editora: '', ano_publicacao: '', categoria: '', isbn: '', quantidade_total: '', quantidade_disponivel: '' })}}
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Livro'}
          </button>
        )}
      </div>

      {/* Formulário de Cadastro/Edição com Card do Bootstrap */}
      {mostrarForm && (
        <div className="card shadow-sm mb-4 border-0 bg-light">
          <div className="card-body p-4">
            <h5 className="card-title mb-4 fw-bold">{editandoId ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h5>
            <form onSubmit={handleSalvar}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">Título</label>
                  <input type="text" className="form-control" required value={formLivro.titulo} onChange={(e) => setFormLivro({...formLivro, titulo: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">Autor</label>
                  <input type="text" className="form-control" required value={formLivro.autor} onChange={(e) => setFormLivro({...formLivro, autor: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">Editora</label>
                  <input type="text" className="form-control" required value={formLivro.editora} onChange={(e) => setFormLivro({...formLivro, editora: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="form-label text-muted small mb-1">Ano</label>
                  <input type="number" className="form-control" required value={formLivro.ano_publicacao} onChange={(e) => setFormLivro({...formLivro, ano_publicacao: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">Categoria</label>
                  <input type="text" className="form-control" required value={formLivro.categoria} onChange={(e) => setFormLivro({...formLivro, categoria: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">ISBN</label>
                  <input type="text" className="form-control" required value={formLivro.isbn} onChange={(e) => setFormLivro({...formLivro, isbn: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">Qtd. Total</label>
                  <input type="number" className="form-control" required value={formLivro.quantidade_total} onChange={(e) => setFormLivro({...formLivro, quantidade_total: e.target.value})} />
                </div>
                {editandoId && (
                  <div className="col-md-3">
                    <label className="form-label text-muted small mb-1">Qtd. Disponível</label>
                    <input type="number" className="form-control" required value={formLivro.quantidade_disponivel} onChange={(e) => setFormLivro({...formLivro, quantidade_disponivel: e.target.value})} />
                  </div>
                )}
              </div>
              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary px-4 fw-semibold">
                  {editandoId ? 'Atualizar Livro' : 'Salvar Livro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* Painel de Filtros */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body bg-light rounded">
          <div className="row g-2 align-items-center">
            <div className="col-md-2">
              <input type="text" className="form-control form-control-sm" placeholder="Título..." value={filtros.titulo} onChange={(e) => setFiltros({...filtros, titulo: e.target.value})} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control form-control-sm" placeholder="Autor..." value={filtros.autor} onChange={(e) => setFiltros({...filtros, autor: e.target.value})} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control form-control-sm" placeholder="Categoria..." value={filtros.categoria} onChange={(e) => setFiltros({...filtros, categoria: e.target.value})} />
            </div>
            <div className="col-md-2">
              <input type="text" className="form-control form-control-sm" placeholder="ISBN..." value={filtros.isbn} onChange={(e) => setFiltros({...filtros, isbn: e.target.value})} />
            </div>
            <div className="col-md-2">
              <select className="form-select form-select-sm" value={filtros.status} onChange={(e) => setFiltros({...filtros, status: e.target.value})}>
                  <option value="">Status (Todos)</option>
                  <option value="disponível">Disponível</option>
                  <option value="indisponível">Indisponível</option>
              </select>
            </div>
            <div className="col-md-2 d-flex gap-2">
              <button className="btn btn-primary btn-sm w-100 fw-semibold" onClick={buscarLivros}>Buscar</button>
              <button className="btn btn-secondary btn-sm w-100 fw-semibold" onClick={limparFiltros}>Limpar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light text-muted small">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Categoria</th>
                  <th>ISBN</th>
                  <th className="text-center">Estoque</th>
                  <th className="text-center">Status</th>
                  {podeGerenciar && <th className="text-end pe-4">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {livros.map((livro) => (
                  <tr key={livro.id}>
                    <td className="ps-4 fw-semibold text-secondary">#{livro.id}</td>
                    <td className="fw-bold">{livro.titulo}</td>
                    <td>{livro.autor}</td>
                    <td><span className="badge bg-secondary opacity-75">{livro.categoria}</span></td>
                    <td className="text-muted small">{livro.isbn}</td>
                    <td className="text-center fw-semibold">
                      {livro.quantidade_disponivel} <span className="text-muted fw-normal">/ {livro.quantidade_total}</span>
                    </td>
                    <td className="text-center">
                      <span className={`badge ${livro.status === 'disponível' ? 'bg-success' : 'bg-danger'}`}>
                        {livro.status}
                      </span>
                    </td>
                    {podeGerenciar && (
                      <td className="text-end pe-4">
                        <button className="btn btn-sm btn-warning me-2 text-dark fw-semibold" onClick={() => prepararEdicao(livro)}>Editar</button>
                        {podeExcluir && <button className="btn btn-sm btn-outline-danger fw-semibold" onClick={() => handleExcluir(livro.id)}>Excluir</button>}
                      </td>
                    )}
                  </tr>
                ))}
                {livros.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center py-5 text-muted">Nenhum livro encontrado.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Livros;