
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllTransactions } from "@/services/transactionService";
import { Transaction } from "@/types/models";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  useEffect(() => {
    const allTransactions = getAllTransactions();
    // Get only the 5 most recent transactions
    setTransactions(allTransactions.slice(0, 5));
  }, []);
  
  return (
    <Card className="dashboard-card">
      <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Transacciones Recientes</CardTitle>
          <CardDescription>Tus últimas transacciones financieras</CardDescription>
        </div>
        <Button asChild variant="ghost" className="flex items-center gap-1" size="sm">
          <Link to="/transactions">
            Ver todas <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    transaction.type === "income" ? "bg-emerald-100" : "bg-rose-100"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <ArrowDownCircle className="h-5 w-5 text-rose-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(transaction.date), "dd MMM, yyyy", { locale: es })} •{" "}
                      {transaction.category}
                    </p>
                  </div>
                </div>
                <div className={`font-medium ${
                  transaction.type === "income" 
                    ? "text-emerald-600" 
                    : "text-rose-600"
                }`}>
                  {transaction.type === "income" ? "+" : "-"}
                  ₡{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No hay transacciones recientes.</p>
            <Button className="mt-4" size="sm" asChild>
              <Link to="/transactions">
                Añadir transacción
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
