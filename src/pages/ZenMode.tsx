
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, ArrowRight, Coins, Target, TrendingUp, FileText } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { addTransaction } from "@/services/transactionService";
import { useUserSettings } from "@/context/UserSettingsContext";
import { calculateNetBalance } from "@/services/transactionService";
import { getAllGoals } from "@/services/goalService";

const ZenMode = () => {
  const { toast } = useToast();
  const [expense, setExpense] = useState("");
  const [income, setIncome] = useState("");
  const [savings, setSavings] = useState(() => calculateNetBalance());
  const { userSettings } = useUserSettings();
  const { currencySymbol } = userSettings;
  
  // Get current goals for goal progress
  const goals = getAllGoals();
  const activeGoal = goals.length > 0 ? goals[0] : null;
  
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!expense || isNaN(Number(expense)) || Number(expense) <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor ingrese una cantidad válida de gasto",
        variant: "destructive",
      });
      return;
    }
    
    // Add a real transaction
    const expenseAmount = Number(expense);
    const newTransaction = addTransaction({
      description: "Gasto registrado desde Modo Zen",
      amount: expenseAmount,
      type: 'expense',
      category: 'Otros',
      date: new Date().toISOString().split('T')[0],
      notes: 'Añadido desde Modo Zen',
    });
    
    // Update savings display using actual data
    setSavings(calculateNetBalance());
    
    toast({
      title: "Gasto añadido",
      description: `${currencySymbol}${expenseAmount.toFixed(2)} ha sido añadido a tus gastos.`,
    });
    setExpense("");
  };
  
  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!income || isNaN(Number(income)) || Number(income) <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor ingrese una cantidad válida de ingreso",
        variant: "destructive",
      });
      return;
    }
    
    // Add a real transaction
    const incomeAmount = Number(income);
    const newTransaction = addTransaction({
      description: "Ingreso registrado desde Modo Zen",
      amount: incomeAmount,
      type: 'income',
      category: 'Otros',
      date: new Date().toISOString().split('T')[0],
      notes: 'Añadido desde Modo Zen',
    });
    
    // Update savings display using actual data
    setSavings(calculateNetBalance());
    
    toast({
      title: "Ingreso añadido",
      description: `${currencySymbol}${incomeAmount.toFixed(2)} ha sido añadido a tus ingresos.`,
    });
    setIncome("");
  };
  
  // Simple, calming financial tips for Zen mode
  const zenTips = [
    "Concéntrate en el progreso, no en la perfección con tus finanzas.",
    "Los pequeños ahorros se acumulan con el tiempo. Ten paciencia contigo mismo.",
    "Aprende a ganar mientras duermes, o trabajarás hasta morir.",
    "Invertir en ti siempre tendrá el mejor retorno. Tu mente y salud son tu mayor activo.",
    "Cada peso que gastas te acerca o te aleja de la vida que quieres. Hazlo consciente.",
    "Cada vez que gastas para impresionar a alguien, financias una inseguridad, no una necesidad.",
    "Si no controlas tus finanzas, alguien más lo hará por ti… y no será a tu favor.",
    "Tu entorno determina tu cuenta bancaria. Júntate con gente que hable de ideas, no de personas.",
    "El caos financiero empieza en la cabeza. Ordena tus pensamientos y tus cuentas te seguirán.",
    "Registra tus gastos sin juzgarlos. La conciencia es el primer paso.",
    "Recuerda que tu valor no está determinado por tu patrimonio neto.",
  ];
  
  const monthlyGoal = activeGoal ? activeGoal.targetAmount : 100000;
  const currentSavings = activeGoal ? activeGoal.currentAmount : savings;
  const goalProgress = activeGoal ? (currentSavings / monthlyGoal) * 100 : 0;
  
  const noDataView = (
    <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
      <CardHeader className="text-center">
        <CardTitle>No hay datos financieros disponibles</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <FileText className="h-16 w-16 mx-auto text-muted-foreground/60 mb-4" />
        <p className="text-muted-foreground mb-6">
          Aún no hay información disponible. Comienza agregando tus datos financieros.
        </p>
        <Button variant="outline" asChild>
          <a href="/transactions">Añadir Transacciones</a>
        </Button>
      </CardContent>
    </Card>
  );
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Modo Financiero Zen</h1>
            <p className="text-muted-foreground mb-6">
              Un enfoque minimalista para gestionar tus finanzas sin estrés
            </p>
          </div>
          
          {/* Simplified Financial Overview */}
          <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <CardHeader>
              <div className="flex items-center justify-center">
                <Coins className="h-8 w-8 text-blue-500 mr-2" />
                <CardTitle>Tu Balance Financiero</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold mb-6">{currencySymbol}{savings.toFixed(2)}</div>
              <p className="text-muted-foreground">
                {savings > 0 
                  ? "Tus finanzas están en un buen lugar. Recuerda, se trata de progreso, no de perfección."
                  : "Un paso a la vez. El camino hacia la estabilidad financiera requiere paciencia."}
              </p>
            </CardContent>
          </Card>
          
          {/* Monthly Goal */}
          {activeGoal ? (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-green-500 mr-2" />
                  <CardTitle>Meta: {activeGoal.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Actual: {currencySymbol}{activeGoal.currentAmount.toFixed(2)}</span>
                    <span className="font-medium">Meta: {currencySymbol}{activeGoal.targetAmount.toFixed(2)}</span>
                  </div>
                  <Progress value={goalProgress} className="h-2" />
                </div>
                <div className="text-center text-sm text-muted-foreground">
                  {goalProgress >= 100 ? (
                    <span className="text-green-500 font-medium">¡Meta alcanzada! 🎉</span>
                  ) : (
                    <span>{currencySymbol}{(activeGoal.targetAmount - activeGoal.currentAmount).toFixed(2)} más para alcanzar tu meta</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <Target className="h-5 w-5 text-green-500 mr-2" />
                  <CardTitle>Metas de Ahorro</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Aún no has establecido ninguna meta de ahorro.
                </p>
                <Button variant="outline" asChild>
                  <a href="/goals">Crear una Meta</a>
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Simple Input Forms */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Add Expense Form */}
            <Card>
              <CardHeader>
                <CardTitle>Registrar Gasto</CardTitle>
                <CardDescription>
                  Registra tus gastos diarios de forma simple
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddExpense}>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="expense">Cantidad del Gasto ({currencySymbol})</Label>
                    <Input
                      id="expense"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={expense}
                      onChange={(e) => setExpense(e.target.value)}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={handleAddExpense}
                  variant="outline"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Registrar Gasto
                </Button>
              </CardFooter>
            </Card>
            
            {/* Add Income Form */}
            <Card>
              <CardHeader>
                <CardTitle>Registrar Ingreso</CardTitle>
                <CardDescription>
                  Registra tus fuentes de ingresos de forma simple
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddIncome}>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="income">Cantidad del Ingreso ({currencySymbol})</Label>
                    <Input
                      id="income"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={income}
                      onChange={(e) => setIncome(e.target.value)}
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={handleAddIncome}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Registrar Ingreso
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Zen Financial Tip */}
          <Card className="border-none bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-center">Consejo Financiero INFINICORE</CardTitle>
            </CardHeader>
            <CardContent>
              <blockquote className="text-center italic text-lg mb-2">
                "{zenTips[Math.floor(Math.random() * zenTips.length)]}"
              </blockquote>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="link" onClick={() => {
                // Just reload the component to get a new tip
                const randomTipIndex = Math.floor(Math.random() * zenTips.length);
                document.querySelector('blockquote')!.textContent = `"${zenTips[randomTipIndex]}"`;
              }}>
                Obtener Otro Consejo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
          
          {/* Return to Standard Mode */}
          <div className="text-center">
            <Button variant="outline" asChild>
              <a href="/">
                <TrendingUp className="mr-2 h-4 w-4" />
                Volver al Panel Principal
              </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              El panel principal proporciona análisis financieros más detallados
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ZenMode;
