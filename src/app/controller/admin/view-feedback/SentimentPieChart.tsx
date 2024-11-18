import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface SentimentPieChartProps {
  satisfiedCount: number;
  neutralCount: number;
  dissatisfiedCount: number;
}

const SentimentPieChart: React.FC<SentimentPieChartProps> = ({
  satisfiedCount,
  neutralCount,
  dissatisfiedCount,
}) => {
  const data = {
    labels: ["Satisfied", "Neutral", "Dissatisfied"],
    datasets: [
      {
        data: [satisfiedCount, neutralCount, dissatisfiedCount],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 mx-auto my-4">
      <Pie data={data} options={options} />
    </div>
  );
};

export default SentimentPieChart;
