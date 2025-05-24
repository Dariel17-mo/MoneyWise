
import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAllTransactions } from "@/services/transactionService";
import { Transaction } from "@/types/models";

// Define the colors for the pie chart
const COLORS = ["#0ea5e9", "#f97316", "#8b5cf6", "#10b981", "#f43f5e", "#6b7280", "#eab308", "#ec4899"];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function ExpenseBreakdown() {
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    generateChartData();
  }, []);

  const generateChartData = () => {
    const transactions = getAllTransactions();
    
    // Filter only expense transactions
    const expenses = transactions.filter(t => t.type === 'expense');
    
    if (expenses.length === 0) {
      setChartData([]);
      return;
    }
    
    // Group expenses by category
    const categoryTotals: Record<string, number> = {};
    
    expenses.forEach((transaction: Transaction) => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });
    
    // Convert to array for chart
    const formattedData = Object.keys(categoryTotals).map((category, index) => ({
      name: category,
      value: categoryTotals[category],
      color: COLORS[index % COLORS.length]
    }));
    
    // Sort by value (highest first)
    formattedData.sort((a, b) => b.value - a.value);
    
    // Only show top 7 categories, group the rest as "Other"
    if (formattedData.length > 7) {
      const topCategories = formattedData.slice(0, 6);
      const otherCategories = formattedData.slice(6);
      const otherTotal = otherCategories.reduce((sum, item) => sum + item.value, 0);
      
      topCategories.push({
        name: "Otros",
        value: otherTotal,
        color: COLORS[6]
      });
      
      setChartData(topCategories);
    } else {
      setChartData(formattedData);
    }
  };

  return (
    <Card className="dashboard-card">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Desglose de Gastos</CardTitle>
        <CardDescription>Distribución de gastos por categoría</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₡${value.toFixed(2)}`} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center">
              <p className="text-muted-foreground">No hay datos suficientes para mostrar el gráfico.</p>
              <p className="text-sm text-muted-foreground mt-2">
                Añade transacciones para visualizar el desglose de tus gastos.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
