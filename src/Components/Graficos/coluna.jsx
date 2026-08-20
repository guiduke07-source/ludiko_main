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
      height: 350,
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
    },
    yaxis: {
      labels: { show: false },
    },
    tooltip: {
      y: {
        formatter: (valor) => `${valor} min`,
      },
    },
    title: {
      text: 'Tempo de uso',
      floating: true,
      offsetY: 330,
      align: 'center',
      style: { color: '#444' },
    },
  };

  if (frequencia.length === 0) {
    return <p>Nenhum registro de uso encontrado.</p>;
  }

  return (
    <div id="chart">
      <Chart
        options={options}
        series={series}
        type="bar"
        height={350}
      />
    </div>
  );
}

export default Coluna;