import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  uploaderCount: number;
  seekerCount: number;
}

const UploaderSeeker: React.FC<BarChartProps> = ({
  uploaderCount,
  seekerCount,
}) => {
  const chartData = {
    labels: ["Uploader", "Seeker"],
    datasets: [
      {
        data: [uploaderCount, seekerCount],
        backgroundColor: ["#4CAF50", "#FF9800"],
        borderColor: ["#388E3C", "#F57C00"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full sm:w-80 md:w-96 lg:w-[500px] h-300 mx-auto">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default UploaderSeeker;
