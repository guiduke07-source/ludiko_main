import React from 'react';
import Chart from 'react-apexcharts';

function Pizza({ progresso = [] }) {
  if (progresso.length === 0) {
    return <p>Nenhum progresso encontrado.</p>;
  }

  const series = progresso.map((categoria) =>
    Math.round((Number(categoria.porcentagem) || 0) * 100)
  );

  const options = {
    chart: {
      width: '100%',
      type: 'pie',
    },
    colors: progresso.map((categoria) => categoria.cor || '#91C7D3'),
    legend: { show: false },
    dataLabels: {
  enabled: true,
  formatter: (_, options) => {
    return `${series[options.seriesIndex]}%`;
  },
},
    labels: progresso.map(
      (categoria) => categoria.titulo_categoria || 'Sem categoria'
    ),
    tooltip: {
      y: {
        formatter: (valor) => `${valor}%`,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { width: 200 },
        },
      },
    ],
  };

  return (
  <div
    className="chart-pizza-item"
    style={{
      width: '300px',
      height: '300px',
      flex: '0 0 300px',
      margin: '0 auto',
    }}
  >
    <Chart
      options={options}
      series={series}
      type="pie"
      width={300}
      height={300}
    />
  </div>
);
}

export default Pizza;