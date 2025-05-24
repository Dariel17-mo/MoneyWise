
import React, { useState, useEffect } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, AlertCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Budget } from "@/types/models";
import { 
  getAllBudgets, 
  addBudget as addBudgetService, 
  deleteBudget as deleteBudgetService,
  updateBudget as updateBudgetService
} from "@/services/budgetService";
// Importar el servicio de transacciones para calcular gastos por nombre
import { getAllTransactions } from "@/services/transactionService";

// Categorías de presupuestos
const budgetCategories = [
  "Alimentación",
  "Vivienda",
  "Transporte",
  "Entretenimiento",
  "Salud",
  "Educación",
  "Compras",
  "Cuidado Personal",
  "Servicios",
  "Viajes",
  "Seguros",
  "Deudas",
  "Otros",
];

const colors = ["blue", "green", "orange", "red", "purple", "teal", "indigo", "pink"];

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState({
    name: "",
    limit: "",
    category: "",
    period: "mensual",
    color: "blue",
  });
  const { toast } = useToast();

  // Función para calcular gastos por nombre específico
  const calculateSpentByName = (budgetName: string) => {
    const transactions = getAllTransactions();
    const currentDate = new Date();
    
    return transactions
      .filter(transaction => {
        // Filtrar solo gastos (amount negativo o tipo expense/egreso)
        const isExpense = transaction.amount < 0 || 
                         transaction.type === 'expense' ;
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

  // Cargar presupuestos al inicio
  useEffect(() => {
    loadBudgets();
  }, []);

  const loadBudgets = () => {
    const loadedBudgets = getAllBudgets();
    
    // Calcular gastos reales para cada presupuesto basado en el nombre
    const budgetsWithSpent = loadedBudgets.map(budget => ({
      ...budget,
      spent: calculateSpentByName(budget.name)
    }));
    
    setBudgets(budgetsWithSpent);
  };

  const getProgressColor = (spent: number, limit: number) => {
    const ratio = spent / limit;
    if (ratio < 0.6) return "bg-green-500";
    if (ratio < 0.8) return "bg-yellow-500";
    return "bg-red-500";
  };

  const handleAddBudget = () => {
    if (!newBudget.name || !newBudget.limit || !newBudget.category) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const budgetData = {
      name: newBudget.name,
      limit: Number(newBudget.limit),
      category: newBudget.category,
      period: newBudget.period,
      color: newBudget.color,
    };

    addBudgetService(budgetData);
    loadBudgets();
    
    setNewBudget({
      name: "",
      limit: "",
      category: "",
      period: "mensual",
      color: "blue",
    });
    setIsAddModalOpen(false);

    toast({
      title: "Presupuesto creado",
      description: `Tu presupuesto para ${budgetData.name} ha sido creado.`,
    });
  };

  const handleEditBudget = () => {
    if (!currentBudget) return;
    
    updateBudgetService(currentBudget);
    loadBudgets();
    
    setIsEditModalOpen(false);
    setCurrentBudget(null);
    
    toast({
      title: "Presupuesto actualizado",
      description: "Los cambios han sido guardados.",
    });
  };

  const openEditModal = (budget: Budget) => {
    setCurrentBudget(budget);
    setIsEditModalOpen(true);
  };

  const deleteBudget = (id: string) => {
    deleteBudgetService(id);
    loadBudgets();
    
    toast({
      title: "Presupuesto eliminado",
      description: "El presupuesto ha sido eliminado.",
    });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Presupuestos</h1>
            <p className="text-muted-foreground">
              Establece y controla tus límites de gastos por concepto específico
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Presupuesto
          </Button>
        </div>

        {budgets.length === 0 ? (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <AlertCircle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No hay presupuestos</h3>
                <p className="text-muted-foreground">
                  Aún no has creado ningún presupuesto. Crea uno para comenzar a controlar tus gastos.
                </p>
              </div>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Crear Presupuesto
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {budgets.map((budget) => {
              const progressPercentage = (budget.spent / budget.limit) * 100;
              const progressColor = getProgressColor(budget.spent, budget.limit);
              const isOverBudget = budget.spent > budget.limit;

              return (
                <Card key={budget.id}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle>{budget.name}</CardTitle>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditModal(budget)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteBudget(budget.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{budget.category} | {budget.period}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>
                          Gastado: ₡{budget.spent.toFixed(2)}
                        </span>
                        <span>
                          Límite: ₡{budget.limit.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={Math.min(progressPercentage, 100)} className={progressColor} />
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div>
                        {isOverBudget && (
                          <div className="flex items-center text-red-500 font-medium">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            Excedido por ₡{(budget.spent - budget.limit).toFixed(2)}
                          </div>
                        )}
                        {!isOverBudget && (
                          <span>
                            ₡{(budget.limit - budget.spent).toFixed(2)} restante
                          </span>
                        )}
                      </div>
                      <span>{Math.round(progressPercentage)}% usado</span>
                    </div>
                    {/* Indicador de que se basa en nombre específico */}
                    <div className="text-xs text-muted-foreground border-t pt-2">
                      Seguimiento por nombre: "{budget.name}"
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal para Añadir Presupuesto */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Crear Presupuesto</DialogTitle>
            <DialogDescription>
              Establece un límite de gasto para un concepto específico. El seguimiento se basará en transacciones que contengan el nombre del presupuesto.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Presupuesto</Label>
              <Input
                id="name"
                placeholder="Ej: Luz, Alimentación, Gasolina"
                value={newBudget.name}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, name: e.target.value })
                }
              />
              <p className="text-xs text-muted-foreground">
                El nombre debe coincidir con las descripciones de tus transacciones
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="limit">Límite de Cantidad</Label>
              <Input
                id="limit"
                type="number"
                placeholder="0.00"
                value={newBudget.limit}
                onChange={(e) =>
                  setNewBudget({ ...newBudget, limit: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoría</Label>
              <Select
                value={newBudget.category}
                onValueChange={(value) =>
                  setNewBudget({ ...newBudget, category: value })
                }
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {budgetCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Solo para organización visual, no afecta el cálculo de gastos
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="period">Periodo</Label>
              <Select
                value={newBudget.period}
                onValueChange={(value) =>
                  setNewBudget({ ...newBudget, period: value })
                }
              >
                <SelectTrigger id="period">
                  <SelectValue placeholder="Selecciona un periodo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="anual">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="color">Color</Label>
              <Select
                value={newBudget.color}
                onValueChange={(value) =>
                  setNewBudget({ ...newBudget, color: value })
                }
              >
                <SelectTrigger id="color">
                  <SelectValue placeholder="Selecciona un color" />
                </SelectTrigger>
                <SelectContent>
                  {colors.map((color) => (
                    <SelectItem key={color} value={color}>
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleAddBudget}>Guardar Presupuesto</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Presupuesto */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Presupuesto</DialogTitle>
            <DialogDescription>
              Modifica los detalles de este presupuesto. El seguimiento se basa en el nombre específico.
            </DialogDescription>
          </DialogHeader>
          {currentBudget && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Nombre del Presupuesto</Label>
                <Input
                  id="edit-name"
                  value={currentBudget.name}
                  onChange={(e) =>
                    setCurrentBudget({ ...currentBudget, name: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Cambiar el nombre afectará qué transacciones se incluyen en el cálculo
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-limit">Límite de Cantidad</Label>
                <Input
                  id="edit-limit"
                  type="number"
                  value={currentBudget.limit}
                  onChange={(e) =>
                    setCurrentBudget({ ...currentBudget, limit: Number(e.target.value) })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-period">Periodo</Label>
                <Select
                  value={currentBudget.period}
                  onValueChange={(value) =>
                    setCurrentBudget({ ...currentBudget, period: value })
                  }
                >
                  <SelectTrigger id="edit-period">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-color">Color</Label>
                <Select
                  value={currentBudget.color}
                  onValueChange={(value) =>
                    setCurrentBudget({ ...currentBudget, color: value })
                  }
                >
                  <SelectTrigger id="edit-color">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color.charAt(0).toUpperCase() + color.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditBudget}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Budgets;
