
import React, { useState, useEffect } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle, Target, Calendar, Edit, Trash2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addMonths } from "date-fns";
import { es } from 'date-fns/locale';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Goal } from "@/types/models";
import {
  getAllGoals,
  addGoal as addGoalService,
  updateGoal as updateGoalService,
  deleteGoal as deleteGoalService,
  addFundsToGoal
} from "@/services/goalService";

const iconOptions = [
  "💰", "🚗", "✈️", "🏠", "💻", "📚", "👶", "🎓", "⚕️", "🏋️",
];

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState<Goal | null>(null);
  const [fundsToAdd, setFundsToAdd] = useState("");
  const [newGoal, setNewGoal] = useState({
    name: "",
    icon: "💰",
    targetAmount: "",
    currentAmount: "0",
    deadline: addMonths(new Date(), 6),
    category: "ahorros",
    priority: "media",
    notes: "",
  });
  const { toast } = useToast();

  // Cargar metas al inicio
  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const loadedGoals = getAllGoals();
    // Convert string dates back to Date objects for the UI
    const goalsWithDateObjects = loadedGoals.map(goal => ({
      ...goal,
      deadline: new Date(goal.deadline)
    }));
    setGoals(goalsWithDateObjects);
  };

  const handleAddGoal = () => {
    if (!newGoal.name || !newGoal.targetAmount) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const goalData = {
      name: newGoal.name,
      icon: newGoal.icon,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount),
      deadline: newGoal.deadline,
      category: newGoal.category,
      priority: newGoal.priority,
      notes: newGoal.notes,
    };

    addGoalService(goalData);
    loadGoals();
    
    setNewGoal({
      name: "",
      icon: "💰",
      targetAmount: "",
      currentAmount: "0",
      deadline: addMonths(new Date(), 6),
      category: "ahorros",
      priority: "media",
      notes: "",
    });
    setIsAddModalOpen(false);

    toast({
      title: "Meta creada",
      description: `Tu meta financiera "${goalData.name}" ha sido creada.`,
    });
  };

  const handleEditGoal = () => {
    if (!currentGoal) return;
    
    updateGoalService(currentGoal);
    loadGoals();
    
    setIsEditModalOpen(false);
    setCurrentGoal(null);
    
    toast({
      title: "Meta actualizada",
      description: "Los cambios han sido guardados.",
    });
  };

  const handleAddFunds = () => {
    if (!currentGoal || !fundsToAdd || isNaN(Number(fundsToAdd)) || Number(fundsToAdd) <= 0) {
      toast({
        title: "Cantidad inválida",
        description: "Por favor ingresa una cantidad válida mayor a cero.",
        variant: "destructive",
      });
      return;
    }
    
    addFundsToGoal(currentGoal.id, Number(fundsToAdd));
    loadGoals();
    
    setIsAddFundsModalOpen(false);
    setCurrentGoal(null);
    setFundsToAdd("");
    
    toast({
      title: "Fondos añadidos",
      description: `Has añadido ₡${fundsToAdd} a tu meta.`,
    });
  };

  const openEditModal = (goal: Goal) => {
    setCurrentGoal(goal);
    setIsEditModalOpen(true);
  };

  const openAddFundsModal = (goal: Goal) => {
    setCurrentGoal(goal);
    setIsAddFundsModalOpen(true);
  };

  const deleteGoal = (id: string) => {
    deleteGoalService(id);
    loadGoals();
    
    toast({
      title: "Meta eliminada",
      description: "La meta financiera ha sido eliminada.",
    });
  };

  const filterGoalsByCategory = (category: string) => {
    if (category === "all") {
      return goals;
    }
    return goals.filter((goal) => goal.category === category);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Metas Financieras</h1>
            <p className="text-muted-foreground">
              Establece y controla tus metas financieras
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Meta
          </Button>
        </div>

        <div className="space-y-6">
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">Todas las Metas</TabsTrigger>
              <TabsTrigger value="ahorros">Ahorros</TabsTrigger>
              <TabsTrigger value="compra">Compras</TabsTrigger>
              <TabsTrigger value="viajes">Viajes</TabsTrigger>
              <TabsTrigger value="deudas">Deudas</TabsTrigger>
            </TabsList>
            {["all", "ahorros", "compra", "viajes", "deudas"].map((category) => (
              <TabsContent key={category} value={category}>
                {filterGoalsByCategory(category).length === 0 ? (
                  <Card className="p-8">
                    <div className="flex flex-col items-center justify-center text-center space-y-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Target className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">No hay metas</h3>
                        <p className="text-muted-foreground">
                          {category === "all" 
                            ? "Aún no has creado ninguna meta financiera. Crea una para comenzar a alcanzar tus objetivos."
                            : `No tienes metas en la categoría ${category}. Crea una nueva meta para esta categoría.`}
                        </p>
                      </div>
                      <Button onClick={() => setIsAddModalOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear Meta
                      </Button>
                    </div>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filterGoalsByCategory(category).map((goal) => {
                      const progressPercentage = (goal.currentAmount / goal.targetAmount) * 100;
                      const formattedDeadline = format(new Date(goal.deadline), "dd MMM, yyyy", { locale: es });
                      const daysLeft = Math.ceil(
                        (new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <Card key={goal.id} className="overflow-hidden">
                          <div className={`h-2 ${
                            goal.priority === "alta" ? "bg-red-500" :
                            goal.priority === "media" ? "bg-yellow-500" :
                            "bg-green-500"
                          }`} />
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <span className="text-2xl mr-2">{goal.icon}</span>
                                <CardTitle>{goal.name}</CardTitle>
                              </div>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => openEditModal(goal)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => deleteGoal(goal.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                            <CardDescription className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Fecha límite: {formattedDeadline} ({daysLeft} días restantes)
                              </span>
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span>₡{goal.currentAmount.toLocaleString()}</span>
                                <span>₡{goal.targetAmount.toLocaleString()}</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>
                                  ₡{(goal.targetAmount - goal.currentAmount).toLocaleString()} por completar
                                </span>
                                <span>{Math.round(progressPercentage)}% completado</span>
                              </div>
                            </div>
                            
                            {goal.notes && (
                              <div className="text-sm text-muted-foreground">
                                <p>{goal.notes}</p>
                              </div>
                            )}
                          </CardContent>
                          <CardFooter className="pt-0">
                            <Button 
                              variant="outline" 
                              className="w-full"
                              onClick={() => openAddFundsModal(goal)}
                            >
                              Añadir Fondos
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>

      {/* Modal para Añadir Meta */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nueva Meta</DialogTitle>
            <DialogDescription>
              Configura una nueva meta financiera para realizar seguimiento de tu progreso.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-3">
                <Label htmlFor="name">Nombre de la Meta</Label>
                <Input
                  id="name"
                  placeholder="Ej: Fondo de Emergencia"
                  value={newGoal.name}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, name: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="icon">Icono</Label>
                <Select
                  value={newGoal.icon}
                  onValueChange={(value) =>
                    setNewGoal({ ...newGoal, icon: value })
                  }
                >
                  <SelectTrigger id="icon">
                    <SelectValue placeholder="Icono" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetAmount">Cantidad Objetivo (₡)</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="0.00"
                  value={newGoal.targetAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, targetAmount: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="currentAmount">Cantidad Actual (₡)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  placeholder="0.00"
                  value={newGoal.currentAmount}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, currentAmount: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={newGoal.category}
                  onValueChange={(value) =>
                    setNewGoal({ ...newGoal, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ahorros">Ahorros</SelectItem>
                    <SelectItem value="compra">Compra</SelectItem>
                    <SelectItem value="viajes">Viajes</SelectItem>
                    <SelectItem value="deudas">Deudas</SelectItem>
                    <SelectItem value="educacion">Educación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="priority">Prioridad</Label>
                <Select
                  value={newGoal.priority}
                  onValueChange={(value) =>
                    setNewGoal({ ...newGoal, priority: value })
                  }
                >
                  <SelectTrigger id="priority">
                    <SelectValue placeholder="Selecciona prioridad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="deadline">Fecha Límite</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="deadline"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newGoal.deadline && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {newGoal.deadline ? (
                      format(newGoal.deadline, "dd 'de' MMMM, yyyy", { locale: es })
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={newGoal.deadline}
                    onSelect={(date) =>
                      date && setNewGoal({ ...newGoal, deadline: date })
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="notes">Notas (Opcional)</Label>
              <Input
                id="notes"
                placeholder="Añade algunos detalles sobre esta meta..."
                value={newGoal.notes}
                onChange={(e) => setNewGoal({ ...newGoal, notes: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddGoal}>Crear Meta</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Editar Meta */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Meta</DialogTitle>
            <DialogDescription>
              Modifica los detalles de tu meta financiera.
            </DialogDescription>
          </DialogHeader>
          {currentGoal && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 gap-4">
                <div className="col-span-3">
                  <Label htmlFor="edit-name">Nombre de la Meta</Label>
                  <Input
                    id="edit-name"
                    value={currentGoal.name}
                    onChange={(e) =>
                      setCurrentGoal({ ...currentGoal, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-icon">Icono</Label>
                  <Select
                    value={currentGoal.icon}
                    onValueChange={(value) =>
                      setCurrentGoal({ ...currentGoal, icon: value })
                    }
                  >
                    <SelectTrigger id="edit-icon">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-targetAmount">Cantidad Objetivo (₡)</Label>
                  <Input
                    id="edit-targetAmount"
                    type="number"
                    value={currentGoal.targetAmount}
                    onChange={(e) =>
                      setCurrentGoal({ ...currentGoal, targetAmount: Number(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-currentAmount">Cantidad Actual (₡)</Label>
                  <Input
                    id="edit-currentAmount"
                    type="number"
                    value={currentGoal.currentAmount}
                    onChange={(e) =>
                      setCurrentGoal({ ...currentGoal, currentAmount: Number(e.target.value) })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-category">Categoría</Label>
                  <Select
                    value={currentGoal.category}
                    onValueChange={(value) =>
                      setCurrentGoal({ ...currentGoal, category: value })
                    }
                  >
                    <SelectTrigger id="edit-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ahorros">Ahorros</SelectItem>
                      <SelectItem value="compra">Compra</SelectItem>
                      <SelectItem value="viajes">Viajes</SelectItem>
                      <SelectItem value="deudas">Deudas</SelectItem>
                      <SelectItem value="educacion">Educación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-priority">Prioridad</Label>
                  <Select
                    value={currentGoal.priority}
                    onValueChange={(value) =>
                      setCurrentGoal({ ...currentGoal, priority: value })
                    }
                  >
                    <SelectTrigger id="edit-priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Media</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-deadline">Fecha Límite</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="edit-deadline"
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(new Date(currentGoal.deadline), "dd 'de' MMMM, yyyy", { locale: es })}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={new Date(currentGoal.deadline)}
                      onSelect={(date) =>
                        date && setCurrentGoal({ ...currentGoal, deadline: date })
                      }
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="edit-notes">Notas (Opcional)</Label>
                <Input
                  id="edit-notes"
                  value={currentGoal.notes}
                  onChange={(e) => setCurrentGoal({ ...currentGoal, notes: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEditGoal}>Guardar Cambios</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para Añadir Fondos */}
      <Dialog open={isAddFundsModalOpen} onOpenChange={setIsAddFundsModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Añadir Fondos</DialogTitle>
            <DialogDescription>
              {currentGoal && `Añade fondos a tu meta: ${currentGoal.name}`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="add-funds">Cantidad a añadir (₡)</Label>
              <Input
                id="add-funds"
                type="number"
                placeholder="0.00"
                value={fundsToAdd}
                onChange={(e) => setFundsToAdd(e.target.value)}
              />
            </div>
            {currentGoal && (
              <div className="mt-4 text-sm">
                <p className="flex justify-between">
                  <span>Cantidad actual:</span>
                  <span className="font-medium">₡{currentGoal.currentAmount.toFixed(2)}</span>
                </p>
                <p className="flex justify-between mt-1">
                  <span>Nueva cantidad:</span>
                  <span className="font-medium">
                    ₡{(currentGoal.currentAmount + (parseFloat(fundsToAdd) || 0)).toFixed(2)}
                  </span>
                </p>
                <p className="flex justify-between mt-1">
                  <span>Meta final:</span>
                  <span className="font-medium">₡{currentGoal.targetAmount.toFixed(2)}</span>
                </p>
                <Progress 
                  value={(parseFloat(fundsToAdd) 
                    ? (currentGoal.currentAmount + parseFloat(fundsToAdd)) / currentGoal.targetAmount * 100
                    : currentGoal.currentAmount / currentGoal.targetAmount * 100)}
                  className="h-2 mt-2"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFundsModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddFunds}>Añadir</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Goals;
