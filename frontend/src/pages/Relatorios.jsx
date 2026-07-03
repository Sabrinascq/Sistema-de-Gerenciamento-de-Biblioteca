import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Registra os componentes necessários do Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Relatorios() {
  const [estatisticas, setEstatisticas] = useState({ totalLivros: 0, totalLeitores: 0, emprestimosAtivos: 0, atrasados: 0 });

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const resLivros = await api.get('/livros');
        const resLeitores = await api.get('/leitores');
        const resEmprestimos = await api.get('/emprestimos');

        const leitoresAtivos = resLeitores.data.filter(leitor => leitor.status === 'ativo').length;

        const ativos = resEmprestimos.data.filter(emp => emp.status === 'Em aberto').length;
        const atrasados = resEmprestimos.data.filter(emp => emp.status === 'Atrasado').length;

        setEstatisticas({
          totalLivros: resLivros.data.totalItems || 0, 
          totalLeitores: leitoresAtivos,
          emprestimosAtivos: ativos,
          atrasados: atrasados
        });
      } catch (error) {
        console.error("Erro ao carregar relatórios", error);
      }
    };
    carregarDados();
  }, []);

  // Configuração dos dados para o Chart.js
  const data = {
    labels: ['Total de Livros', 'Leitores Ativos', 'Empréstimos', 'Atrasados'],
    datasets: [
      {
        label: 'Quantidade',
        data: [
          estatisticas.totalLivros, 
          estatisticas.totalLeitores, 
          estatisticas.emprestimosAtivos, 
          estatisticas.atrasados
        ],
        backgroundColor: [
          '#0d6efd', // Azul (Livros)
          '#198754', // Verde (Leitores)
          '#ffc107', // Amarelo (Empréstimos)
          '#dc3545', // Vermelho (Atrasados)
        ],
        borderRadius: 8, // Bordas arredondadas modernas
        borderSkipped: false,
      },
    ],
  };

  // Configuração visual do Gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Esconde a legenda superior pois as labels já explicam
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { size: 14, family: 'Inter' },
        bodyFont: { size: 14, family: 'Inter', weight: 'bold' },
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 } // Garante que o eixo Y mostre apenas números inteiros
      },
      x: {
        grid: { display: false },
        ticks: { font: { weight: '600', family: 'Inter' }, color: '#6c757d' }
      }
    }
  };

  return (
    <div className="container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
        <h2 className="fw-bold text-secondary">Dashboard de Relatórios</h2>
        <button className="btn btn-primary fw-semibold shadow-sm" onClick={() => window.print()}>
          🖨️ Imprimir Relatório
        </button>
      </div>

      <div className="row g-4 mb-4">
        {/* Cards Superiores */}
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-primary text-white h-100">
            <div className="card-body p-4 text-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Total de Livros</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.totalLivros}</h1>
            </div>
          </div>
        </div>
        
        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-success text-white h-100">
            <div className="card-body p-4 text-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Leitores Ativos</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.totalLeitores}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-warning text-dark h-100">
            <div className="card-body p-4 text-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Empréstimos Abertos</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.emprestimosAtivos}</h1>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm bg-danger text-white h-100">
            <div className="card-body p-4 text-center">
              <h6 className="card-title text-uppercase opacity-75 fw-bold mb-3">Devoluções Atrasadas</h6>
              <h1 className="display-4 fw-bold mb-0">{estatisticas.atrasados}</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Seção do Gráfico */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h5 className="fw-bold text-secondary mb-4 text-center">Visão Geral do Sistema</h5>
          <div style={{ width: '100%', height: '350px' }}>
            <Bar data={data} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Relatorios;