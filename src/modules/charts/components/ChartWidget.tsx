"use client"

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"
import { Bar, Line, Pie } from "react-chartjs-2"
import type { ColumnDefinition } from "@/core/project"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
)

interface ChartWidgetProps {
  data: Record<string, unknown>[]
  columns: ColumnDefinition[]
  chartType: "line" | "bar" | "pie"
  labelColumn?: string
  valueColumn?: string
  title?: string
}

export function ChartWidget({
  data,
  columns,
  chartType,
  labelColumn,
  valueColumn,
  title,
}: ChartWidgetProps) {
  const numericCols = columns.filter((c) => c.type === "number")
  const labelCol = labelColumn
    ? columns.find((c) => c.id === labelColumn)
    : columns.find((_c) => true)
  const valueCol = valueColumn ? columns.find((c) => c.id === valueColumn) : numericCols[0]

  const labels = data.map((row) => String(labelCol ? row[labelCol.name] : row[Object.keys(row)[0]]))
  const values = data.map(
    (row) => Number(valueCol ? row[valueCol.name] : Object.values(row)[0]) || 0,
  )

  const chartData = {
    labels,
    datasets: [
      {
        label: valueCol?.label || valueCol?.name || "Valor",
        data: values,
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)",
          "rgba(16, 185, 129, 0.5)",
          "rgba(245, 158, 11, 0.5)",
          "rgba(239, 68, 68, 0.5)",
          "rgba(139, 92, 246, 0.5)",
          "rgba(236, 72, 153, 0.5)",
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(236, 72, 153, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: !!title,
        text: title,
      },
    },
  }

  return (
    <div className="h-full min-h-[300px]">
      {chartType === "line" && <Line data={chartData} options={options} />}
      {chartType === "bar" && <Bar data={chartData} options={options} />}
      {chartType === "pie" && <Pie data={chartData} options={options} />}
    </div>
  )
}
