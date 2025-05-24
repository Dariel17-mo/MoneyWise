
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, Wallet, Clock } from "lucide-react";
import { calculateTotalIncome, calculateTotalExpense, calculateNetBalance } from "@/services/transactionService";

export function FinancialSummary() {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  
  useEffect(() => {
    // Load financial data from storage
    loadFinancialData();
  }, []);
  
  const loadFinancialData = () => {
    setTotalIncome(calculateTotalIncome());
    setTotalExpense(calculateTotalExpense());
    setNetBalance(calculateNetBalance());
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₡{totalIncome.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total de ingresos registrados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Gastos Totales</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₡{totalExpense.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            Total de gastos registrados
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Balance Neto</CardTitle>
          <div className={`w-4 h-4 rounded-full ${netBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₡{netBalance.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground">
            {netBalance >= 0 
              ? 'Tus ingresos superan tus gastos' 
              : 'Tus gastos superan tus ingresos'}
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Mes Actual</CardTitle>
          <Clock className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Date().toLocaleString('es-ES', { month: 'long' })}
          </div>
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
