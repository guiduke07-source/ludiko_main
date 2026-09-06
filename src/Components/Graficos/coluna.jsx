import React from 'react';
import Chart from 'react-apexcharts';

function formatarDia(registro) {
  if (!registro.data) {
    return registro.dia_semana || '';
  }

  return new Date(registro.data).toLocaleDateString('pt-BR', {
    weekday: 'short',
  });
}

function Coluna({ frequencia = [] }) {
  const series = [
    {
      name: 'Tempo de uso',
      data: frequencia.map(
        (registro) => Number(registro.minutos_uso) || 0
      ),
    },
  ];

  const options = {
    chart: {
      height: 320,
      type: 'bar',
      toolbar: { show: false },
    },
    colors: frequencia.map((registro) => registro.cor || '#91C7D3'),
    legend: { show: false },
    grid: { show: false },
    plotOptions: {
      bar: {
        borderRadius: 10,
        distributed: true,
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: frequencia.map(formatarDia),
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: '#666',
          fontSize: '13px',
          fontFamily: 'Baloo 2, sans-serif',
        },
      },
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      y: {
        formatter: (valor) => `${valor} min`,
      },
    },
  };

  if (frequencia.length === 0) {
    return <p>Nenhum registro de uso encontrado.</p>;
  }

  return (
    <div id="chart" style={{ width: '100%', textAlign: 'center' }}>
      <Chart
        options={options}
        series={series}
        type="bar"
        height={320}
      />
      <p
        style={{
          marginTop: '16px',
          fontSize: '16px',
          fontWeight: '700',
          color: '#444444',
          fontFamily: 'Baloo 2, sans-serif',
          letterSpacing: '0.2px',
        }}
      >
        Tempo de uso
      </p>
    </div>
  );
}

export default Coluna;