import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function BarChart({ data = [], theme = 'light' }) { // default ป้องกัน undefined
  if (!data || data.length === 0) {
    return <p style={{ color: theme === 'dark' ? '#fff' : '#000' }}>No data available</p>;
  }

  // แยก labels และ magnitudes
  const labels = data.map(item => item.date);
  const magnitudes = data.map(item => item.magnitude);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Magnitude',
        data: magnitudes,
        backgroundColor: data.map(item => {
        const mag = item.magnitude;
        if (mag < 3) return '#90ee90';
        if (mag < 5) return '#ffff66';
        if (mag < 6) return '#ffa500';
        if (mag < 7) return '#ff3333';
        return '#8b0000';
      }),

      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => `Magnitude: ${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
      y: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000',
        },
      },
    },
  };

  return <Bar options={chartOptions} data={chartData} />;
}

export default BarChart;
