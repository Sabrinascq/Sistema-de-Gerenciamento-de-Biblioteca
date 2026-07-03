import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Relatorios() {
  const [estatisticas, setEstatisticas] = useState({ totalLivros: 0, totalLeitores: 0, emprestimosAtivos: 0, atrasados: 0 });

  useEffect(() => {
    // Faz chamadas rápidas para as rotas já existentes para montar o Dashboard
    const carregarDados = async () => {
      try {
        const resLivros = await api.get('/livros');
        const resLeitores = await api.get('/leitores');
        const resEmprestimos = await api.get('/emprestimos');

        const ativos = resEmprestimos.data.filter(emp => emp.status === 'Em aberto').length;
        const atrasados = resEmprestimos.data.filter(emp => emp.status === 'Atrasado').length;

        setEstatisticas({
          totalLivros: resLivros.data.length,
          totalLeitores: resLeitores.data.length,
          emprestimosAtivos: ativos,
          atrasados: atrasados
        });
      } catch (error) {
        console.error("Erro ao carregar relatórios", error);
      }
    };
    carregarDados();
  }, []);

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-secondary">Dashboard de Relatórios</h2>
        <button className="btn btn-primary fw-semibold shadow-sm" onClick={() => window.print()}>
          🖨️ Imprimir Relatório
        </button>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white h-100">
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Total de Livros</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.totalLivros}</h1>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success text-white h-100">
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Leitores Ativos</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.totalLeitores}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-warning text-dark h-100">
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Empréstimos Abertos</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.emprestimosAtivos}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-danger text-white h-100">
            <div className="card-body p-4 d-flex flex-column justify-content-center align-items-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Devoluções Atrasadas</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.atrasados}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-5 text-center bg-light rounded">
          <h4 className="text-muted mb-3 fw-bold">Sistema Operando Normalmente</h4>
          <p className="text-secondary mb-0">As estatísticas acima refletem os dados em tempo real do banco de dados.</p>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;