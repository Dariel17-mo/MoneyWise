
import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BarChart, PieChart, LineChart, Download, Share, Calendar, FileText } from "lucide-react";
import { format, subMonths } from "date-fns";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { 
  getAllTransactions, 
  calculateTotalIncome,
  calculateTotalExpense,
  calculateNetBalance
} from "@/services/transactionService";
import { useUserSettings } from "@/context/UserSettingsContext";
import { es } from 'date-fns/locale';

interface CategoryTotal {
  name: string;
  value: number;
}

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeRange, setTimeRange] = useState("6m");
  const [chartType, setChartType] = useState("area");
  const { userSettings } = useUserSettings();
  const { currencySymbol } = userSettings;
  
  // Function to get date range for display
  const getDateRange = () => {
    const end = date || new Date();
    let start;
    
    switch (timeRange) {
      case "1m":
        start = subMonths(end, 1);
        break;
      case "3m":
        start = subMonths(end, 3);
        break;
      case "1y":
        start = subMonths(end, 12);
        break;
      case "6m":
      default:
        start = subMonths(end, 6);
    }
    
    return `${format(start, "MMM d, yyyy", { locale: es })} - ${format(end, "MMM d, yyyy", { locale: es })}`;
  };
  
  const formatTooltipName = (name: string | number | React.ReactNode) => {
    if (typeof name === 'string') {
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return name;
  };
  
  // Get all transactions
  const transactions = getAllTransactions();
  
  // Calculate if we have any data
  const hasData = transactions.length > 0;
  
  // Group transactions by month
  const groupTransactionsByMonth = () => {
    const monthlyData: Record<string, { income: number, expenses: number, savings: number }> = {};
    
    // Initialize months for the selected time range
    const end = date || new Date();
    let current;
    
    switch (timeRange) {
      case "1m":
        current = subMonths(end, 1);
        break;
      case "3m":
        current = subMonths(end, 3);
        break;
      case "1y":
        current = subMonths(end, 12);
        break;
      case "6m":
      default:
        current = subMonths(end, 6);
    }
    
    while (current <= end) {
      const monthKey = format(current, 'MMM', { locale: es });
      monthlyData[monthKey] = { income: 0, expenses: 0, savings: 0 };
      current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    }
    
    // Add transaction data
    transactions.forEach(transaction => {
      const transDate = new Date(transaction.date);
      const monthKey = format(transDate, 'MMM', { locale: es });
      
      // Only include transactions within the selected time range
      if (transDate >= subMonths(end, Number(timeRange.replace('m', '').replace('y', '12'))) && 
          transDate <= end && 
          monthlyData[monthKey]) {
        
        if (transaction.type === 'income') {
          monthlyData[monthKey].income += transaction.amount;
        } else {
          monthlyData[monthKey].expenses += transaction.amount;
        }
      }
    });
    
    // Calculate savings
    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].savings = monthlyData[month].income - monthlyData[month].expenses;
    });
    
    // Convert to array for recharts
    return Object.keys(monthlyData).map(month => ({
      month,
      Ingresos: monthlyData[month].income,
      Gastos: monthlyData[month].expenses,
      Ahorros: monthlyData[month].savings
    }));
  };
  
  // Calculate expense breakdown by category
  const calculateExpensesByCategory = (): CategoryTotal[] => {
    const categories: Record<string, number> = {};
    
    transactions.forEach(transaction => {
      if (transaction.type === 'expense') {
        if (categories[transaction.category]) {
          categories[transaction.category] += transaction.amount;
        } else {
          categories[transaction.category] = transaction.amount;
        }
      }
    });
    
    return Object.keys(categories).map(name => ({
      name,
      value: categories[name]
    }));
  };
  
  // Get chart data
  const chartData = hasData ? groupTransactionsByMonth() : [];
  const categoryData = hasData ? calculateExpensesByCategory() : [];
  
  // Calculate totals
  const totalIncome = calculateTotalIncome();
  const totalExpense = calculateTotalExpense();
  const netBalance = calculateNetBalance();
  const savingRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Informes Financieros</h1>
            <p className="text-muted-foreground">
              Analiza y comprende tus datos financieros
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  {getDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <ToggleGroup type="single" value={timeRange} onValueChange={(val) => val && setTimeRange(val)}>
              <ToggleGroupItem value="1m">1M</ToggleGroupItem>
              <ToggleGroupItem value="3m">3M</ToggleGroupItem>
              <ToggleGroupItem value="6m">6M</ToggleGroupItem>
              <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
        
        {!hasData ? (
          <Card className="text-center p-10">
            <CardHeader>
              <CardTitle>No hay información disponible</CardTitle>
              <CardDescription>
                Aún no hay información disponible. Comienza agregando tus datos financieros.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <FileText className="mx-auto h-16 w-16 text-muted-foreground/60" />
              <Button variant="outline" className="mt-8" asChild>
                <a href="/transactions">Añadir Transacciones</a>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle>Ingresos vs. Gastos</CardTitle>
                    <CardDescription>
                      Seguimiento de tu flujo financiero en el tiempo
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ToggleGroup type="single" value={chartType} onValueChange={(val) => val && setChartType(val)}>
                      <ToggleGroupItem value="bar" size="sm">
                        <BarChart className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="line" size="sm">
                        <LineChart className="h-4 w-4" />
                      </ToggleGroupItem>
                      <ToggleGroupItem value="area" size="sm">
                        <PieChart className="h-4 w-4" />
                      </ToggleGroupItem>
                    </ToggleGroup>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 20,
                      }}
                    >
                      <defs>
                        <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
                        </linearGradient>
                        <linearGradient id="savingsGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value, name) => [
                          `${currencySymbol}${value}`, 
                          formatTooltipName(name)
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="Ingresos"
                        stroke="#4f46e5"
                        fillOpacity={1}
                        fill="url(#incomeGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="Gastos"
                        stroke="#ef4444"
                        fillOpacity={1}
                        fill="url(#expenseGradient)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="Ahorros"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#savingsGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full max-w-md mx-auto grid grid-cols-1 gap-4 mb-6 p-2 bg-muted/20 rounded-lg">
                  <TabsTrigger
                    value="overview"
                    className="w-full py-3 text-center font-medium transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    Resumen
                  </TabsTrigger>
                </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Resumen Mensual</CardTitle>
                      <CardDescription>
                        Resumen financiero para el período seleccionado
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-500">{currencySymbol}{totalIncome.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Ingresos</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-500">{currencySymbol}{totalExpense.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Gastos</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-500">{currencySymbol}{netBalance.toFixed(2)}</div>
                          <div className="text-sm text-muted-foreground">Ahorros</div>
                        </div>
                      </div>
                      <div className="mt-6 space-y-4">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Tasa de Ahorro</span>
                            <span className="font-medium">{savingRate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                            <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${Math.min(100, Math.max(0, savingRate))}%` }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {categoryData.length > 0 ? (
                    <Card>
                      <CardHeader>
                        <CardTitle>Desglose de Gastos</CardTitle>
                        <CardDescription>
                          Dónde fue tu dinero este mes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {categoryData.map((category, index) => {
                            const percentage = Math.round((category.value / totalExpense) * 100);
                            const colors = [
                              "bg-blue-500",
                              "bg-green-500",
                              "bg-yellow-500",
                              "bg-purple-500",
                              "bg-orange-500",
                              "bg-indigo-500",
                              "bg-pink-500",
                              "bg-emerald-500"
                            ];
                            const color = colors[index % colors.length];
                            
                            return (
                              <div key={category.name}>
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full ${color} mr-2`} />
                                    <span>{category.name}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="font-medium">{currencySymbol}{category.value.toFixed(2)}</span>
                                    <span className="text-xs text-muted-foreground ml-2">
                                      ({percentage}%)
                                    </span>
                                  </div>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
                                  <div 
                                    className={`h-2 ${color} rounded-full`} 
                                    style={{ width: `${percentage}%` }} 
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ) : (
                    <Card>
                      <CardHeader>
                        <CardTitle>Desglose de Gastos</CardTitle>
                        <CardDescription>
                          No hay categorías de gastos registradas aún
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center py-8">
                        <p className="text-muted-foreground mb-4">
                          Añade transacciones con categorías para ver tu desglose de gastos
                        </p>
                        <Button variant="outline" asChild>
                          <a href="/transactions">Añadir Transacciones</a>
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="income">
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis de Ingresos</CardTitle>
                    <CardDescription>
                      Desglose detallado de tus fuentes de ingresos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-12">
                      <p className="text-muted-foreground">
                        Aún no hay información disponible para análisis de ingresos.
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <a href="/transactions">Añadir Fuente de Ingresos</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="expenses">
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis de Gastos</CardTitle>
                    <CardDescription>
                      Desglose detallado de tus gastos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-12">
                      <p className="text-muted-foreground">
                        Aún no hay información disponible para análisis de gastos.
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <a href="/transactions">Ver Todos los Gastos</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="savings">
                <Card>
                  <CardHeader>
                    <CardTitle>Análisis de Ahorros</CardTitle>
                    <CardDescription>
                      Seguimiento de tu progreso de ahorros y metas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center p-12">
                      <p className="text-muted-foreground">
                        Aún no hay información disponible para análisis de ahorros.
                      </p>
                      <Button className="mt-4" variant="outline" asChild>
                        <a href="/goals">Ver Metas de Ahorro</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;
