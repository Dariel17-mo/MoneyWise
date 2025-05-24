
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { getAllBudgets } from "@/services/budgetService";
import { getAllTransactions } from "@/services/transactionService";
import { Budget } from "@/types/models";

export function BudgetProgress() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  
  // Función para calcular gastos por nombre específico (igual que en Budgets component)
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
    const allBudgets = getAllBudgets();
    
    // Calcular gastos reales para cada presupuesto basado en el nombre
    const budgetsWithSpent = allBudgets.map(budget => ({
      ...budget,
      spent: calculateSpentByName(budget.name)
    }));
    
    // Only show top 3 budgets with highest spent percentage
    const sortedBudgets = budgetsWithSpent
      .map(budget => ({
        ...budget,
        percentage: (budget.spent / budget.limit) * 100
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 3);
      
    setBudgets(sortedBudgets);
  }, []);
  
  // Function to get the color of the progress bar
  const getProgressColor = (spent: number, limit: number) => {
    const ratio = spent / limit;
    if (ratio < 0.6) return "bg-emerald-500";
    if (ratio < 0.8) return "bg-yellow-500";
    return "bg-rose-500";
  };
  
  return (
    <Card className="dashboard-card">
      <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Presupuestos</CardTitle>
          <CardDescription>Seguimiento de tus presupuestos por concepto específico</CardDescription>
        </div>
        <Button asChild variant="ghost" className="flex items-center gap-1" size="sm">
          <Link to="/budgets">
            Ver todos <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {budgets.length > 0 ? (
          <div className="space-y-5">
            {budgets.map((budget) => {
              const progressPercentage = (budget.spent / budget.limit) * 100;
              const progressColor = getProgressColor(budget.spent, budget.limit);
              
              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex justify-between">
                    <p className="text-sm font-medium">{budget.name}</p>
                    <p className="text-sm">
                      ₡{budget.spent.toFixed(2)} / ₡{budget.limit.toFixed(2)}
                    </p>
                  </div>
                  <Progress value={Math.min(progressPercentage, 100)} className={progressColor} />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{budget.category}</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center">
            <p className="text-muted-foreground">No hay presupuestos activos.</p>
            <Button className="mt-4" size="sm" asChild>
              <Link to="/budgets">
                Crear presupuesto
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}