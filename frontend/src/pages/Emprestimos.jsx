import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Emprestimos() {
  const [emprestimos, setEmprestimos] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [filtros, setFiltros] = useState({ status: '', nome_leitor: '', data_emprestimo: '' });
  const [formEmprestimo, setFormEmprestimo] = useState({ leitorId: '', livrosIdsText: '', data_emprestimo: '', data_prevista_devolucao: '' });

  const user = JSON.parse(localStorage.getItem('user'));
  const podeGerenciar = user?.tipo === 'Administrador' || user?.tipo === 'Bibliotecário';
  const isLeitor = user?.tipo === 'Leitor';

  useEffect(() => { carregarEmprestimos(); }, []);

  const carregarEmprestimos = async () => {
    try {
      const endpoint = isLeitor ? '/emprestimos/meus' : '/emprestimos';
      const resposta = await api.get(endpoint);
      setEmprestimos(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar empréstimos", error);
    }
  };

  const buscarEmprestimos = async () => {
    try {
      const resposta = await api.get('/emprestimos/buscar', { params: filtros });
      setEmprestimos(resposta.data);
    } catch (error) {
      alert("Erro ao buscar empréstimos.");
    }
  };

  const limparFiltros = () => {
    setFiltros({ status: '', nome_leitor: '', data_emprestimo: '' });
    carregarEmprestimos();
  };

  const formatarData = (data) => {
    if (!data) return '-';
    const dataLimpa = data.split('T')[0];
    const [ano, mes, dia] = dataLimpa.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const handleEmprestar = async (e) => {
    e.preventDefault();
    try {
      const arrayDeIds = formEmprestimo.livrosIdsText.split(',').map((id) => parseInt(id.trim())).filter((id) => !isNaN(id));
      if (arrayDeIds.length === 0) {
        alert("Digite pelo menos um ID de livro válido.");
        return;
      }
      const payload = {
        leitorId: formEmprestimo.leitorId,
        livroIds: arrayDeIds,
        data_emprestimo: formEmprestimo.data_emprestimo,
        data_prevista_devolucao: formEmprestimo.data_prevista_devolucao
      };
      await api.post('/emprestimos', payload);
      alert('Empréstimo realizado com sucesso!');
      setMostrarForm(false);
      setFormEmprestimo({ leitorId: '', livrosIdsText: '', data_emprestimo: '', data_prevista_devolucao: '' });
      carregarEmprestimos();
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao realizar empréstimo.');
    }
  };

  const handleDevolver = async (id) => {
    if (window.confirm('Confirmar a devolução total deste empréstimo?')) {
      try {
        await api.put(`/emprestimos/${id}/devolver`);
        carregarEmprestimos();
      } catch (error) {
        alert(error.response?.data?.erro || 'Erro ao registrar devolução.');
      }
    }
  };

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-secondary">{isLeitor ? 'Meus Empréstimos' : 'Controle de Empréstimos'}</h2>
        {podeGerenciar && (
          <button 
            className={`btn ${mostrarForm ? 'btn-outline-secondary' : 'btn-success'} fw-semibold shadow-sm`}
            onClick={() => setMostrarForm(!mostrarForm)}
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Empréstimo'}
          </button>
        )}
      </div>

      {podeGerenciar && (
        <div className="card shadow-sm mb-4 border-0">
          <div className="card-body bg-white rounded">
            <div className="row g-2 align-items-center">
              <div className="col-md-3">
                <select className="form-select" value={filtros.status} onChange={(e) => setFiltros({...filtros, status: e.target.value})}>
                    <option value="">Status (Todos)</option>
                    <option value="Em aberto">Em aberto</option>
                    <option value="Devolvido">Devolvido</option>
                    <option value="Atrasado">Atrasado</option>
                </select>
              </div>
              <div className="col-md-3">
                <input type="text" className="form-control" placeholder="Nome do Leitor" value={filtros.nome_leitor} onChange={(e) => setFiltros({...filtros, nome_leitor: e.target.value})} />
              </div>
              <div className="col-md-3">
                <input type="date" className="form-control text-muted" value={filtros.data_emprestimo} onChange={(e) => setFiltros({...filtros, data_emprestimo: e.target.value})} title="Data do Empréstimo" />
              </div>
              <div className="col-md-3 d-flex gap-2">
                <button className="btn btn-primary w-100 fw-semibold shadow-sm" onClick={buscarEmprestimos}>Buscar</button>
                <button className="btn btn-secondary w-100 fw-semibold shadow-sm" onClick={limparFiltros}>Limpar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {mostrarForm && podeGerenciar && (
        <div className="card shadow-sm mb-4 border-0 bg-light">
          <div className="card-body p-4">
            <h5 className="card-title mb-4 fw-bold">Registrar Novo Empréstimo</h5>
            <form onSubmit={handleEmprestar}>
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">ID do Leitor</label>
                  <input type="number" className="form-control" placeholder="Ex: 10" required value={formEmprestimo.leitorId} onChange={(e) => setFormEmprestimo({...formEmprestimo, leitorId: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">ID(s) do Livro</label>
                  <input type="text" className="form-control" placeholder="Ex: 1, 3, 5" required value={formEmprestimo.livrosIdsText} onChange={(e) => setFormEmprestimo({...formEmprestimo, livrosIdsText: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">Data Empréstimo</label>
                  <input type="date" className="form-control" required value={formEmprestimo.data_emprestimo} onChange={(e) => setFormEmprestimo({...formEmprestimo, data_emprestimo: e.target.value})} />
                </div>
                <div className="col-md-3">
                  <label className="form-label text-muted small mb-1">Devolução Prevista</label>
                  <input type="date" className="form-control" required value={formEmprestimo.data_prevista_devolucao} onChange={(e) => setFormEmprestimo({...formEmprestimo, data_prevista_devolucao: e.target.value})} />
                </div>
              </div>
              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary px-4 fw-semibold shadow-sm">Registrar Empréstimo</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light text-muted small">
                <tr>
                  <th className="ps-4">ID</th>
                  {!isLeitor && <th>Leitor</th>}
                  <th>Livros Alugados</th>
                  <th>Empréstimo</th>
                  <th>Prev. Devolução</th>
                  <th>Data Real</th>
                  <th className="text-center">Status</th>
                  {podeGerenciar && <th className="text-end pe-4">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {emprestimos.map((emp) => (
                  <tr key={emp.id}>
                    <td className="ps-4 fw-semibold text-secondary">#{emp.id}</td>
                    {!isLeitor && <td className="fw-bold">{emp.Leitor ? emp.Leitor.nome : 'N/A'}</td>}
                    <td className="text-primary fw-semibold">
                      {emp.Livros && emp.Livros.length > 0 ? emp.Livros.map(livro => livro.titulo).join(', ') : 'N/A'}
                    </td>
                    <td className="text-muted">{formatarData(emp.data_emprestimo)}</td>
                    <td className="text-muted">{formatarData(emp.data_prevista_devolucao)}</td>
                    <td className="text-muted">{formatarData(emp.data_real_devolucao)}</td>
                    <td className="text-center">
                      <span className={`badge ${emp.status === 'Atrasado' ? 'bg-danger' : (emp.status === 'Devolvido' ? 'bg-success' : 'bg-primary')}`}>
                        {emp.status}
                      </span>
                    </td>
                    {podeGerenciar && (
                      <td className="text-end pe-4">
                        {emp.status !== 'Devolvido' && (
                          <button className="btn btn-sm btn-outline-success fw-semibold" onClick={() => handleDevolver(emp.id)}>Registrar Devolução</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {emprestimos.length === 0 && (
                  <tr><td colSpan="8" className="text-center py-5 text-muted">Nenhum empréstimo encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Emprestimos;