
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, Filter, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import TransactionList from "@/components/transactions/TransactionList";
import TransactionForm from "@/components/transactions/TransactionForm";
import { useToast } from "@/hooks/use-toast";
import { Transaction, TransactionType } from "@/types/models";
import { 
  getAllTransactions, 
  addTransaction as addTransactionService, 
  deleteTransaction as deleteTransactionService,
  calculateTotalIncome,
  calculateTotalExpense,
  calculateNetBalance
} from "@/services/transactionService";
import { updateAllBudgetsSpent } from "@/services/budgetService";

// Define the form values type to match what TransactionForm will provide
interface TransactionFormValues {
  type: TransactionType;
  description: string;
  amount: number;
  category: string;
  date: Date;
  notes?: string;
}

const Transactions = () => {
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [netBalance, setNetBalance] = useState(0);
  const { toast } = useToast();

  // Cargar transacciones al inicio
  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = () => {
    const loadedTransactions = getAllTransactions();
    setTransactions(loadedTransactions);
    setTotalIncome(calculateTotalIncome());
    setTotalExpense(calculateTotalExpense());
    setNetBalance(calculateNetBalance());
  };

  const addTransaction = (formValues: TransactionFormValues) => {
    const newTransactionData = {
      description: formValues.description,
      amount: formValues.amount,
      type: formValues.type,
      category: formValues.category,
      date: formValues.date.toISOString().split('T')[0], // Convert Date to string format
      notes: formValues.notes || '', // Handle optional notes
    };
    
    const newTransaction = addTransactionService(newTransactionData);
    
    // Actualizar la interfaz
    loadTransactions();
    
    // Actualizar presupuestos relacionados
    if (formValues.type === 'expense') {
      updateAllBudgetsSpent();
    }
    
    setIsAddingTransaction(false);
    
    toast({
      title: "Transacción añadida",
      description: `${newTransaction.type === 'income' ? 'Ingreso' : 'Gasto'} de $${newTransaction.amount.toFixed(2)} ha sido registrado.`,
    });
  };

  const deleteTransaction = (id: string) => {
    deleteTransactionService(id);
    loadTransactions();
    updateAllBudgetsSpent();
    
    toast({
      title: "Transacción eliminada",
      description: "La transacción ha sido eliminada de tus registros.",
    });
  };

  const filterTransactions = (type: string): Transaction[] => {
    if (!transactions.length) return [];
    
    if (type === "all") {
      return transactions.filter(t => 
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return transactions.filter(t => 
      t.type === type && (
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Transacciones</h1>
            <p className="text-muted-foreground">
              Gestiona tus ingresos y gastos
            </p>
          </div>
          <Button 
            onClick={() => setIsAddingTransaction(true)} 
            className="bg-gradient-to-r from-blue-600 to-blue-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Añadir Transacción
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Ingresos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowUpCircle className="h-4 w-4 text-emerald-500 mr-2" />
                <div className="text-2xl font-bold">₡{totalIncome.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gastos Totales
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <ArrowDownCircle className="h-4 w-4 text-rose-500 mr-2" />
                <div className="text-2xl font-bold">₡{totalExpense.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Balance Neto
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-2 ${netBalance >= 0 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                <div className="text-2xl font-bold">₡{netBalance.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Historial de Transacciones</CardTitle>
            <CardDescription>
              Ver y gestionar todas tus transacciones financieras
            </CardDescription>
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="relative flex-grow">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar transacciones..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="income">Ingresos</TabsTrigger>
                <TabsTrigger value="expense">Gastos</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <TransactionList 
                  transactions={filterTransactions("all")}
                  onDelete={deleteTransaction}
                />
              </TabsContent>
              <TabsContent value="income">
                <TransactionList 
                  transactions={filterTransactions("income")}
                  onDelete={deleteTransaction}
                />
              </TabsContent>
              <TabsContent value="expense">
                <TransactionList 
                  transactions={filterTransactions("expense")}
                  onDelete={deleteTransaction}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <TransactionForm 
        isOpen={isAddingTransaction} 
        onClose={() => setIsAddingTransaction(false)} 
        onSubmit={addTransaction}
      />
    </DashboardLayout>
  );
};

export default Transactions;
