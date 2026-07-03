import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formUsuario, setFormUsuario] = useState({ nome: '', email: '', senha: '', tipo: 'Leitor' });

  useEffect(() => { carregarUsuarios(); }, []);

  const carregarUsuarios = async () => {
    try {
      const resposta = await api.get('/usuarios');
      setUsuarios(resposta.data);
    } catch (error) {
      console.error("Erro ao carregar usuários", error);
    }
  };

  const handleSalvar = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        await api.put(`/usuarios/${editandoId}`, formUsuario);
        alert('Usuário atualizado com sucesso!');
      } else {
        await api.post('/usuarios', formUsuario);
        alert('Usuário cadastrado com sucesso!');
      }
      setMostrarForm(false);
      setEditandoId(null);
      setFormUsuario({ nome: '', email: '', senha: '', tipo: 'Leitor' });
      carregarUsuarios();
    } catch (error) {
      alert(error.response?.data?.erro || 'Erro ao salvar usuário.');
    }
  };

  const prepararEdicao = (usuario) => {
    setFormUsuario({ nome: usuario.nome, email: usuario.email, senha: '', tipo: usuario.tipo });
    setEditandoId(usuario.id);
    setMostrarForm(true);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      await api.delete(`/usuarios/${id}`);
      carregarUsuarios();
    }
  };

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-secondary">Gerenciamento de Usuários</h2>
        <button 
          className={`btn ${mostrarForm ? 'btn-outline-secondary' : 'btn-success'} fw-semibold shadow-sm`}
          onClick={() => { setMostrarForm(!mostrarForm); setEditandoId(null); setFormUsuario({ nome: '', email: '', senha: '', tipo: 'Leitor' })}}
        >
          {mostrarForm ? 'Cancelar' : '+ Novo Usuário'}
        </button>
      </div>

      {mostrarForm && (
        <div className="card shadow-sm mb-4 border-0 bg-light">
          <div className="card-body p-4">
            <h5 className="card-title mb-4 fw-bold">{editandoId ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}</h5>
            <form onSubmit={handleSalvar}>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">Nome</label>
                  <input type="text" className="form-control" required value={formUsuario.nome} onChange={(e) => setFormUsuario({...formUsuario, nome: e.target.value})} />
                </div>
                <div className="col-md-4">
                  <label className="form-label text-muted small mb-1">E-mail</label>
                  <input type="email" className="form-control" required value={formUsuario.email} onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="form-label text-muted small mb-1">{editandoId ? 'Nova Senha (Opcional)' : 'Senha'}</label>
                  <input type="password" className="form-control" required={!editandoId} value={formUsuario.senha} onChange={(e) => setFormUsuario({...formUsuario, senha: e.target.value})} />
                </div>
                <div className="col-md-2">
                  <label className="form-label text-muted small mb-1">Perfil</label>
                  <select className="form-select" value={formUsuario.tipo} onChange={(e) => setFormUsuario({...formUsuario, tipo: e.target.value})}>
                    <option value="Leitor">Leitor</option>
                    <option value="Bibliotecário">Bibliotecário</option>
                    <option value="Administrador">Administrador</option>
                  </select>
                </div>
              </div>
              <div className="mt-4 text-end">
                <button type="submit" className="btn btn-primary px-4 fw-semibold shadow-sm">
                  {editandoId ? 'Atualizar Usuário' : 'Salvar Usuário'}
                </button>
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
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th className="text-center">Perfil</th>
                  <th className="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td className="ps-4 fw-semibold text-secondary">#{usuario.id}</td>
                    <td className="fw-bold">{usuario.nome}</td>
                    <td className="text-muted">{usuario.email}</td>
                    <td className="text-center">
                      <span className={`badge ${usuario.tipo === 'Administrador' ? 'bg-danger' : (usuario.tipo === 'Bibliotecário' ? 'bg-primary' : 'bg-secondary')}`}>
                        {usuario.tipo}
                      </span>
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-warning me-2 text-dark fw-semibold" onClick={() => prepararEdicao(usuario)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger fw-semibold" onClick={() => handleExcluir(usuario.id)}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;