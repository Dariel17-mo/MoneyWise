
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { calculateTotalIncome, calculateTotalExpense, getAllTransactions } from "@/services/transactionService";
import { getAllBudgets } from "@/services/budgetService";
import { Transaction } from "@/types/models";

export function FinancialInsights() {
  const [insights, setInsights] = useState<{text: string, icon: any, color: string}[]>([]);
  
  // Función para calcular gastos por nombre específico (igual que en otros componentes)
  const calculateSpentByName = (budgetName: string) => {
    const transactions = getAllTransactions();
    
    return transactions
      .filter(transaction => {
        // Filtrar solo gastos (amount negativo o tipo expense/egreso)
        const isExpense = transaction.amount < 0 || 
                         transaction.type === 'expense';
        if (!isExpense) return false;
        
        // Comparar nombres (case insensitive para mayor flexibilidad)
        const transactionDescription = transaction.description?.toLowerCase() || '';
        const budgetNameLower = budgetName.toLowerCase();
        
        // Buscar coincidencia exacta o que contenga el nombre del presupuesto
        return transactionDescription.includes(budgetNameLower) || 
               budgetNameLower.includes(transactionDescription);
      })
      .reduce((total, transaction) => {
        // Sumar el valor absoluto para tener el gasto total
        return total + Math.abs(transaction.amount);
      }, 0);
  };
  
  useEffect(() => {
    generateInsights();
  }, []);
  
  const generateInsights = () => {
    const generatedInsights: {text: string, icon: any, color: string}[] = [];
    const transactions = getAllTransactions();
    const budgets = getAllBudgets();
    
    const totalIncome = calculateTotalIncome();
    const totalExpense = calculateTotalExpense();
    
    // Insight 1: Income vs Expense
    if (transactions.length > 0) {
      if (totalIncome > totalExpense) {
        generatedInsights.push({
          text: "Tus ingresos son mayores que tus gastos. ¡Buen trabajo manteniendo un balance positivo!",
          icon: TrendingUp,
          color: "text-emerald-500"
        });
      } else if (totalExpense > totalIncome) {
        generatedInsights.push({
          text: "Tus gastos superan tus ingresos. Considera reducir algunos gastos para equilibrar tu presupuesto.",
          icon: TrendingDown,
          color: "text-rose-500"
        });
      }
    }
    
    // Insight 2: Budget Warnings - CORREGIDO: usar cálculo por nombre específico
    const budgetsWithRealSpent = budgets.map(budget => ({
      ...budget,
      spent: calculateSpentByName(budget.name)
    }));
    
    const overBudgets = budgetsWithRealSpent.filter(b => b.spent > b.limit);
    const nearLimitBudgets = budgetsWithRealSpent.filter(b => {
      const percentage = (b.spent / b.limit) * 100;
      return percentage >= 80 && percentage < 100;
    });
    
    if (overBudgets.length > 0) {
      generatedInsights.push({
        text: `Tienes ${overBudgets.length} ${overBudgets.length === 1 ? 'presupuesto' : 'presupuestos'} excedido${overBudgets.length === 1 ? '' : 's'}: ${overBudgets.map(b => b.name).join(', ')}.`,
        icon: AlertCircle,
        color: "text-rose-500"
      });
    } else if (nearLimitBudgets.length > 0) {
      generatedInsights.push({
        text: `Tienes ${nearLimitBudgets.length} ${nearLimitBudgets.length === 1 ? 'presupuesto' : 'presupuestos'} cerca del límite (${nearLimitBudgets.map(b => b.name).join(', ')}).`,
        icon: AlertCircle,
        color: "text-amber-500"
      });
    }
    
    // Insight 3: Category Analysis - CORREGIDO: filtrar por tipo correcto
    if (transactions.length > 3) {
      // Find top spending category
      const expensesByCategory: Record<string, number> = {};
      transactions
        .filter((t: Transaction) => {
          // Filtrar gastos usando la misma lógica
          return t.amount < 0 || t.type === 'expense' ;
        })
        .forEach((t: Transaction) => {
          const amount = Math.abs(t.amount);
          expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + amount;
        });
      
      if (Object.keys(expensesByCategory).length > 0) {
        const topCategory = Object.keys(expensesByCategory).reduce((a, b) => 
          expensesByCategory[a] > expensesByCategory[b] ? a : b
        );
        
        const percentOfTotal = (expensesByCategory[topCategory] / Math.abs(totalExpense)) * 100;
        
        if (percentOfTotal > 50) {
          generatedInsights.push({
            text: `El ${Math.round(percentOfTotal)}% de tus gastos se destinan a ${topCategory}. Considera diversificar tus gastos.`,
            icon: AlertCircle,
            color: "text-blue-500"
          });
        }
      }
    }
    
    // Insight 4: Budget Performance - NUEVO insight más útil
    if (budgetsWithRealSpent.length > 0 && overBudgets.length === 0) {
      const averageUsage = budgetsWithRealSpent.reduce((acc, budget) => {
        return acc + (budget.spent / budget.limit) * 100;
      }, 0) / budgetsWithRealSpent.length;
      
      if (averageUsage < 70) {
        generatedInsights.push({
          text: `Estás usando en promedio el ${Math.round(averageUsage)}% de tus presupuestos. ¡Excelente control de gastos!`,
          icon: TrendingUp,
          color: "text-emerald-500"
        });
      }
    }
    
    // Insight 5: Empty data
    if (transactions.length === 0) {
      generatedInsights.push({
        text: "Comienza añadiendo tus transacciones para obtener análisis financieros personalizados sobre tus finanzas.",
        icon: TrendingUp,
        color: "text-blue-500"
      });
    }
    
    // If no insights, add a default one
    if (generatedInsights.length === 0) {
      generatedInsights.push({
        text: "Sigue registrando tus transacciones para obtener más insights personalizados.",
        icon: TrendingUp,
        color: "text-blue-500"
      });
    }
    
    setInsights(generatedInsights);
  };
  
  return (
    <Card className="dashboard-card">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Análisis Financiero</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {insights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`mt-1 ${insight.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm">{insight.text}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}