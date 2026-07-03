import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Livros() {
  const [livros, setLivros] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  
  // Controle de Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [filtros, setFiltros] = useState({ titulo: '', autor: '', categoria: '', status: '', isbn: '' });
  
  const [formLivro, setFormLivro] = useState({
    titulo: '', autor: '', editora: '', ano_publicacao: '', categoria: '', isbn: '', quantidade_total: '', quantidade_disponivel: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));
  const podeGerenciar = user?.tipo === 'Administrador' || user?.tipo === 'Bibliotecário';
  const podeExcluir = user?.tipo === 'Administrador';

  // Carrega ao montar
  useEffect(() => { carregarLivros(1); }, []);

  const carregarLivros = async (pagina = 1) => {
    try {
      const resposta = await api.get(`/livros?page=${pagina}&limit=5`);
      setLivros(resposta.data.livros);
      setTotalPaginas(resposta.data.totalPages);
      setPaginaAtual(resposta.data.currentPage);
    } catch (error) {
      console.error("Erro ao carregar livros", error);
    }
  };

  const buscarLivros = async (pagina = 1) => {
    try {
      const resposta = await api.get('/livros/buscar', { 
        params: { ...filtros, page: pagina, limit: 5 } 
      });
      setLivros(resposta.data.livros);
      setTotalPaginas(resposta.data.totalPages);
      setPaginaAtual(resposta.data.currentPage);
    } catch (error) {
      alert("Erro ao buscar livros");
    }
  };

  const limparFiltros = () => {
    setFiltros({ titulo: '', autor: '', categoria: '', status: '', isbn: '' });
    carregarLivros(1);
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
      carregarLivros(paginaAtual); // Mantém na mesma página após salvar
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
      carregarLivros(paginaAtual);
    }
  };

  // Função para lidar com clique de mudança de página
  const mudarPagina = (novaPagina) => {
    // Verifica se existe algum filtro preenchido para saber qual rota chamar
    const temFiltro = Object.values(filtros).some(val => val !== '');
    if (temFiltro) {
      buscarLivros(novaPagina);
    } else {
      carregarLivros(novaPagina);
    }
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <h2 className="fw-bold text-secondary mb-0">Gerenciamento de Livros</h2>
        {podeGerenciar && (
          <button 
            className={`btn ${mostrarForm ? 'btn-outline-secondary' : 'btn-success'} shadow-sm`}
            onClick={() => { 
              setMostrarForm(!mostrarForm); 
              setEditandoId(null); 
              setFormLivro({ titulo: '', autor: '', editora: '', ano_publicacao: '', categoria: '', isbn: '', quantidade_total: '', quantidade_disponivel: '' });
            }}
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Livro'}
          </button>
        )}
      </div>

      {/* Formulário */}
      {mostrarForm && (
        <div className="card shadow-sm mb-4 border-0 bg-light">
          <div className="card-body p-4">
            <h5 className="mb-3 fw-bold">{editandoId ? 'Editar Livro' : 'Cadastrar Novo Livro'}</h5>
            <form onSubmit={handleSalvar}>
              <div className="row g-3">
                <div className="col-md-6"><input type="text" className="form-control" placeholder="Título" required value={formLivro.titulo} onChange={(e) => setFormLivro({...formLivro, titulo: e.target.value})} /></div>
                <div className="col-md-6"><input type="text" className="form-control" placeholder="Autor" required value={formLivro.autor} onChange={(e) => setFormLivro({...formLivro, autor: e.target.value})} /></div>
                <div className="col-md-4"><input type="text" className="form-control" placeholder="Editora" required value={formLivro.editora} onChange={(e) => setFormLivro({...formLivro, editora: e.target.value})} /></div>
                <div className="col-md-2"><input type="number" className="form-control" placeholder="Ano" required value={formLivro.ano_publicacao} onChange={(e) => setFormLivro({...formLivro, ano_publicacao: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" className="form-control" placeholder="Categoria" required value={formLivro.categoria} onChange={(e) => setFormLivro({...formLivro, categoria: e.target.value})} /></div>
                <div className="col-md-3"><input type="text" className="form-control" placeholder="ISBN" required value={formLivro.isbn} onChange={(e) => setFormLivro({...formLivro, isbn: e.target.value})} /></div>
                <div className="col-md-3"><input type="number" className="form-control" placeholder="Qtd. Total" required value={formLivro.quantidade_total} onChange={(e) => setFormLivro({...formLivro, quantidade_total: e.target.value})} /></div>
                {editandoId && (
                  <div className="col-md-3"><input type="number" className="form-control" placeholder="Qtd. Disponível" required value={formLivro.quantidade_disponivel} onChange={(e) => setFormLivro({...formLivro, quantidade_disponivel: e.target.value})} /></div>
                )}
              </div>
              <div className="mt-3 text-end">
                <button type="submit" className="btn btn-primary px-4 shadow-sm">{editandoId ? 'Atualizar' : 'Salvar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Busca */}
      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body">
          <div className="row g-2">
            <div className="col-md-2"><input type="text" className="form-control" placeholder="Título" value={filtros.titulo} onChange={(e) => setFiltros({...filtros, titulo: e.target.value})} /></div>
            <div className="col-md-2"><input type="text" className="form-control" placeholder="Autor" value={filtros.autor} onChange={(e) => setFiltros({...filtros, autor: e.target.value})} /></div>
            <div className="col-md-2"><input type="text" className="form-control" placeholder="Categoria" value={filtros.categoria} onChange={(e) => setFiltros({...filtros, categoria: e.target.value})} /></div>
            <div className="col-md-2"><input type="text" className="form-control" placeholder="ISBN" value={filtros.isbn} onChange={(e) => setFiltros({...filtros, isbn: e.target.value})} /></div>
            <div className="col-md-2">
              <select className="form-select" value={filtros.status} onChange={(e) => setFiltros({...filtros, status: e.target.value})}>
                <option value="">Status (Todos)</option>
                <option value="disponível">Disponível</option>
                <option value="indisponível">Indisponível</option>
              </select>
            </div>
            <div className="col-md-2 d-flex gap-2">
              {/* Ao clicar no botão buscar, zera para a página 1 */}
              <button className="btn btn-primary w-100" onClick={() => buscarLivros(1)}>Buscar</button>
              <button className="btn btn-secondary w-100" onClick={limparFiltros}>Limpar</button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">ID</th><th>Título</th><th>Autor</th><th>Categoria</th><th>ISBN</th><th>Disponível</th><th>Status</th>{podeGerenciar && <th className="text-end pe-4">Ações</th>}
              </tr>
            </thead>
            <tbody>
              {livros.map((livro) => (
                <tr key={livro.id}>
                  <td className="ps-4 text-muted">#{livro.id}</td>
                  <td className="fw-bold">{livro.titulo}</td>
                  <td>{livro.autor}</td>
                  <td>{livro.categoria}</td>
                  <td>{livro.isbn}</td>
                  <td>{livro.quantidade_disponivel} / {livro.quantidade_total}</td>
                  <td>
                    <span className={`badge ${livro.status === 'disponível' ? 'bg-success' : 'bg-danger'}`}>
                      {livro.status}
                    </span>
                  </td>
                  {podeGerenciar && (
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-warning me-2" onClick={() => prepararEdicao(livro)}>Editar</button>
                      {podeExcluir && <button className="btn btn-sm btn-outline-danger" onClick={() => handleExcluir(livro.id)}>Excluir</button>}
                    </td>
                  )}
                </tr>
              ))}
              {livros.length === 0 && (
                <tr><td colSpan="8" className="text-center p-4">Nenhum livro encontrado.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Controles de Paginação (Bônus!) */}
        {livros.length > 0 && (
          <div className="d-flex justify-content-between align-items-center p-3 border-top bg-light">
            <span className="text-muted small fw-semibold">
              Mostrando página {paginaAtual} de {totalPaginas}
            </span>
            <div className="btn-group shadow-sm">
              <button 
                className="btn btn-sm btn-outline-primary fw-semibold" 
                disabled={paginaAtual === 1} 
                onClick={() => mudarPagina(paginaAtual - 1)}
              >
                ← Anterior
              </button>
              <button 
                className="btn btn-sm btn-outline-primary fw-semibold" 
                disabled={paginaAtual === totalPaginas || totalPaginas === 0} 
                onClick={() => mudarPagina(paginaAtual + 1)}
              >
                Próxima →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Livros;