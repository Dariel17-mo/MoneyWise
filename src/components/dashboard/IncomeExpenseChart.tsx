
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { calculateTotalIncome, calculateTotalExpense } from "@/services/transactionService";

export function IncomeExpenseChart() {
  const [data, setData] = useState<{ income: number; expenses: number; }>({
    income: 0,
    expenses: 0,
  });

  useEffect(() => {
    // Obtener datos reales de ingresos y gastos
    const totalIncome = calculateTotalIncome();
    const totalExpenses = calculateTotalExpense();
    
    setData({
      income: totalIncome,
      expenses: totalExpenses,
    });
  }, []);

  // Formatear los datos para Recharts
  const chartData = [
    {
      name: "Ingresos",
      valor: data.income,
      color: "#22c55e"
    },
    {
      name: "Gastos",
      valor: data.expenses,
      color: "#ef4444"
    }
  ];

  const hasData = data.income > 0 || data.expenses > 0;

  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Ingresos vs Gastos</CardTitle>
        <CardDescription>
          Comparación entre tus ingresos y gastos totales.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {!hasData ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6">
              <h3 className="text-lg font-medium">No hay datos disponibles</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Añade transacciones para ver la comparación de ingresos y gastos.
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`₡${value}`, ""]}
                  labelFormatter={() => ""}
                />
                <Legend />
                <Bar dataKey="valor" name="Importe" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
