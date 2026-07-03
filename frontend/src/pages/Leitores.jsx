import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Leitores() {
  const [leitores, setLeitores] = useState([]);
  const [filtros, setFiltros] = useState({ nome: '', cpf_ra: '' });
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formLeitor, setFormLeitor] = useState({ nome: '', cpf_ra: '', email: '', telefone: '', endereco: '' });

  const user = JSON.parse(localStorage.getItem('user'));
  const podeGerenciar = user?.tipo === 'Administrador' || user?.tipo === 'Bibliotecário';
  const podeInativar = user?.tipo === 'Administrador';

  useEffect(() => { carregarLeitores(); }, []);

  const carregarLeitores = async () => {
    try {
      const resposta = await api.get('/leitores');
      setLeitores(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar leitores", error);
    }
  };

  const buscarLeitores = async () => {
    try {
      const resposta = await api.get('/leitores/buscar', { params: filtros });
      setLeitores(resposta.data);
    } catch (error) {
      alert("Erro ao buscar leitores");
    }
  };

  const limparFiltros = () => {
    setFiltros({ nome: '', cpf_ra: '' });
    carregarLeitores();
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/leitores/${editandoId}`, formLeitor);
        alert('Leitor atualizado com sucesso!');
      } else {
        await api.post('/leitores', formLeitor);
        alert('Leitor cadastrado com sucesso!');
      }
      setMostrarForm(false);
      setEditandoId(null);
      setFormLeitor({ nome: '', cpf_ra: '', email: '', telefone: '', endereco: '' });
      carregarLeitores();
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao salvar leitor.');
    }
  };

  const prepararEdicao = (leitor) => {
    setFormLeitor(leitor);
    setEditandoId(leitor.id);
    setMostrarForm(true);
  };

  const handleInativar = async (id) => {
    if (window.confirm('Deseja inativar este leitor? O histórico de empréstimos será mantido.')) {
      try {
        await api.patch(`/leitores/${id}/inativar`);
        carregarLeitores();
      } catch (error) {
        alert(error.response?.data?.erro || 'Erro ao inativar leitor.');
      }
    }
  };

  // ==========================
  // Reativar Leitor
  // ==========================
  const handleReativar = async (id) => {
    if (window.confirm('Deseja reativar o acesso deste leitor?')) {
      try {
        await api.patch(`/leitores/${id}/reativar`);
        carregarLeitores();
      } catch (error) {
        alert(error.response?.data?.erro || 'Erro ao reativar leitor.');
      }
    }
  };

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-secondary">Gerenciamento de Leitores</h2>
        {podeGerenciar && (
          <button 
            className={`btn ${mostrarForm ? 'btn-outline-secondary' : 'btn-success'} fw-semibold shadow-sm`}
            onClick={() => { setMostrarForm(!mostrarForm); setEditandoId(null); setFormLeitor({ nome: '', cpf_ra: '', email: '', telefone: '', endereco: '' })}}
          >
            {mostrarForm ? 'Cancelar' : '+ Novo Leitor'}
          </button>
        )}
      </div>

      {mostrarForm && (
        <div className="card shadow-sm mb-4 border-0 bg-light">
          <div className="card-body p-4">
            <h5 className="card-title mb-4 fw-bold">{editandoId ? 'Editar Leitor' : 'Cadastrar Novo Leitor'}</h5>
            <form onSubmit={handleSalvar}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">Nome Completo</label>
                  <input type="text" className="form-control" required value={formLeitor.nome} onChange={(e) => setFormLeitor({...formLeitor, nome: e.target.value})} />
                </div>
                <div className="col-md-6">
                  <label className="form-label text-muted small mb-1">CPF ou RA</label>
                  <input type="text" className="form-control" required value={formLeitor.cpf_ra} onChange={(e) => setFormLeitor({...formLeitor, cpf_ra: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">E-mail</label>
                  <input type="email" className="form-control" required value={formLeitor.email} onChange={(e) => setFormLeitor({...formLeitor, email: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">Telefone</label>
                  <input type="text" className="form-control" value={formLeitor.telefone} onChange={(e) => setFormLeitor({...formLeitor, telefone: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">Endereço</label>
                  <input type="text" className="form-control" value={formLeitor.endereco} onChange={(e) => setFormLeitor({...formLeitor, endereco: e.target.value})} />
                </div>
              </div>
              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary px-4 fw-semibold shadow-sm">
                  {editandoId ? 'Atualizar Leitor' : 'Salvar Leitor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="card shadow-sm mb-4 border-0">
        <div className="card-body bg-white rounded">
          <div className="row g-2 align-items-center">
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Buscar por Nome..." value={filtros.nome} onChange={(e) => setFiltros({...filtros, nome: e.target.value})} />
            </div>
            <div className="col-md-4">
              <input type="text" className="form-control" placeholder="Buscar por CPF/RA..." value={filtros.cpf_ra} onChange={(e) => setFiltros({...filtros, cpf_ra: e.target.value})} />
            </div>
            <div className="col-md-4 d-flex gap-2">
              <button className="btn btn-primary w-100 fw-semibold shadow-sm" onClick={buscarLeitores}>Buscar</button>
              <button className="btn btn-secondary w-100 fw-semibold shadow-sm" onClick={limparFiltros}>Limpar</button>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-striped mb-0 align-middle">
              <thead className="table-light text-muted small">
                <tr>
                  <th className="ps-4">ID</th>
                  <th>Nome</th>
                  <th>CPF/RA</th>
                  <th className="text-center">Status</th>
                  {podeGerenciar && <th className="text-end pe-4">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {leitores.map((leitor) => (
                  <tr key={leitor.id}>
                    <td className="ps-4 fw-semibold text-secondary">#{leitor.id}</td>
                    <td className="fw-bold">{leitor.nome}</td>
                    <td className="text-muted">{leitor.cpf_ra}</td>
                    <td className="text-center">
                      <span className={`badge ${leitor.status === 'ativo' ? 'bg-success' : 'bg-danger'}`}>
                        {leitor.status}
                      </span>
                    </td>
                    {podeGerenciar && (
                      <td className="text-end pe-4">
                        <button className="btn btn-sm btn-warning me-2 text-dark fw-semibold" onClick={() => prepararEdicao(leitor)}>Editar</button>
                        
                        {/* Botões Dinâmicos: Mostra Inativar ou Reativar dependendo do status */}
                        {podeInativar && leitor.status === 'ativo' && (
                          <button className="btn btn-sm btn-outline-danger fw-semibold" onClick={() => handleInativar(leitor.id)}>Inativar</button>
                        )}

                        {podeInativar && leitor.status === 'inativo' && (
                          <button className="btn btn-sm btn-outline-success fw-semibold" onClick={() => handleReativar(leitor.id)}>Reativar</button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
                {leitores.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-5 text-muted">Nenhum leitor encontrado.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leitores;