
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { PlusCircle, TrendingUp, TrendingDown } from "lucide-react";

// Definir tipos para acciones y criptomonedas
interface Stock {
  id: string;
  name: string;
  symbol: string;
  shares: number;
  buyPrice: number;
  currentPrice: number;
  change: number;
}

interface Crypto {
  id: string;
  name: string;
  symbol: string;
  amount: number;
  buyPrice: number;
  currentPrice: number;
  change: number;
}

// Storage keys
const STORAGE_KEYS = {
  STOCKS: 'finance_stocks',
  CRYPTO: 'finance_crypto',
};

// Helper para guardar datos en localStorage
const saveData = <T,>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error al guardar datos para ${key}:`, error);
  }
};

// Helper para recuperar datos de localStorage
const getData = <T,>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error al recuperar datos para ${key}:`, error);
    return defaultValue;
  }
};

const Investments = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [cryptos, setCryptos] = useState<Crypto[]>([]);
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [isAddCryptoOpen, setIsAddCryptoOpen] = useState(false);
  const [newStock, setNewStock] = useState({
    name: "",
    symbol: "",
    shares: "",
    buyPrice: "",
  });
  const [newCrypto, setNewCrypto] = useState({
    name: "",
    symbol: "",
    amount: "",
    buyPrice: "",
  });
  const { toast } = useToast();

  // Cargar datos al inicio
  useEffect(() => {
    setStocks(getData(STORAGE_KEYS.STOCKS, []));
    setCryptos(getData(STORAGE_KEYS.CRYPTO, []));
  }, []);

  // Calcular valores del portafolio
  const totalStockValue = stocks.reduce((sum, stock) => sum + stock.currentPrice * stock.shares, 0);
  const totalCryptoValue = cryptos.reduce((sum, crypto) => sum + crypto.currentPrice * crypto.amount, 0);
  const totalPortfolioValue = totalStockValue + totalCryptoValue;
  
  // Calcular ganancias/pérdidas totales
  const totalStockInvestment = stocks.reduce((sum, stock) => sum + stock.buyPrice * stock.shares, 0);
  const totalCryptoInvestment = cryptos.reduce((sum, crypto) => sum + crypto.buyPrice * crypto.amount, 0);
  const totalInvestment = totalStockInvestment + totalCryptoInvestment;
  const totalGainLoss = totalPortfolioValue - totalInvestment;
  const totalGainLossPercent = totalInvestment > 0 ? (totalGainLoss / totalInvestment) * 100 : 0;

  const handleAddStock = () => {
    if (!newStock.name || !newStock.symbol || !newStock.shares || !newStock.buyPrice) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const currentPrice = Number(newStock.buyPrice);
    const stock: Stock = {
      id: Date.now().toString(),
      name: newStock.name,
      symbol: newStock.symbol.toUpperCase(),
      shares: Number(newStock.shares),
      buyPrice: Number(newStock.buyPrice),
      currentPrice: currentPrice,
      change: 0,
    };

    const updatedStocks = [...stocks, stock];
    setStocks(updatedStocks);
    saveData(STORAGE_KEYS.STOCKS, updatedStocks);
    
    setNewStock({
      name: "",
      symbol: "",
      shares: "",
      buyPrice: "",
    });
    setIsAddStockOpen(false);

    toast({
      title: "Acción añadida",
      description: `Se añadieron ${stock.shares} acciones de ${stock.symbol} a tu portafolio.`,
    });
  };

  const handleAddCrypto = () => {
    if (!newCrypto.name || !newCrypto.symbol || !newCrypto.amount || !newCrypto.buyPrice) {
      toast({
        title: "Campos incompletos",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      });
      return;
    }

    const currentPrice = Number(newCrypto.buyPrice);
    const crypto: Crypto = {
      id: Date.now().toString(),
      name: newCrypto.name,
      symbol: newCrypto.symbol.toUpperCase(),
      amount: Number(newCrypto.amount),
      buyPrice: Number(newCrypto.buyPrice),
      currentPrice: currentPrice,
      change: 0,
    };

    const updatedCryptos = [...cryptos, crypto];
    setCryptos(updatedCryptos);
    saveData(STORAGE_KEYS.CRYPTO, updatedCryptos);
    
    setNewCrypto({
      name: "",
      symbol: "",
      amount: "",
      buyPrice: "",
    });
    setIsAddCryptoOpen(false);

    toast({
      title: "Criptomoneda añadida",
      description: `Se añadieron ${crypto.amount} ${crypto.symbol} a tu portafolio.`,
    });
  };

  // Actualizar precios manualmente
  const updatePrice = (id: string, newPrice: number, isStock: boolean) => {
    if (isStock) {
      const updatedStocks = stocks.map(stock => 
        stock.id === id 
          ? { 
              ...stock, 
              currentPrice: newPrice,
              change: ((newPrice - stock.buyPrice) / stock.buyPrice) * 100
            } 
          : stock
      );
      setStocks(updatedStocks);
      saveData(STORAGE_KEYS.STOCKS, updatedStocks);
    } else {
      const updatedCryptos = cryptos.map(crypto => 
        crypto.id === id 
          ? { 
              ...crypto, 
              currentPrice: newPrice,
              change: ((newPrice - crypto.buyPrice) / crypto.buyPrice) * 100
            } 
          : crypto
      );
      setCryptos(updatedCryptos);
      saveData(STORAGE_KEYS.CRYPTO, updatedCryptos);
    }
  };

  // Eliminar inversión
  const deleteInvestment = (id: string, isStock: boolean) => {
    if (isStock) {
      const updatedStocks = stocks.filter(s => s.id !== id);
      setStocks(updatedStocks);
      saveData(STORAGE_KEYS.STOCKS, updatedStocks);
      toast({
        title: "Acción eliminada",
        description: "La acción ha sido eliminada de tu portafolio.",
      });
    } else {
      const updatedCryptos = cryptos.filter(c => c.id !== id);
      setCryptos(updatedCryptos);
      saveData(STORAGE_KEYS.CRYPTO, updatedCryptos);
      toast({
        title: "Criptomoneda eliminada",
        description: "La criptomoneda ha sido eliminada de tu portafolio.",
      });
    }
  };

  const hasInvestments = stocks.length > 0 || cryptos.length > 0;

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inversiones</h1>
            <p className="text-muted-foreground">
              Haz seguimiento y gestiona tu portafolio de inversiones
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setIsAddStockOpen(true)} variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Acción
            </Button>
            <Button onClick={() => setIsAddCryptoOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Añadir Criptomoneda
            </Button>
          </div>
        </div>

        {hasInvestments ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Valor del Portafolio
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₡{totalPortfolioValue.toFixed(2)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total de todas las inversiones
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Ganancia/Pérdida Total
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    {totalGainLoss >= 0 ? (
                      <TrendingUp className="h-4 w-4 text-emerald-500 mr-2" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-rose-500 mr-2" />
                    )}
                    <div className={`text-2xl font-bold ${totalGainLoss >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      ₡{Math.abs(totalGainLoss).toFixed(2)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {totalGainLoss >= 0 ? 'Beneficio' : 'Pérdida'}: {Math.abs(totalGainLossPercent).toFixed(2)}%
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Distribución de Activos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Acciones</span>
                      <span className="text-sm font-medium">
                        {totalPortfolioValue > 0 ? ((totalStockValue / totalPortfolioValue) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-blue-500 rounded-full" 
                        style={{ width: `${totalPortfolioValue > 0 ? (totalStockValue / totalPortfolioValue) * 100 : 0}%` }} 
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm">Criptomonedas</span>
                      <span className="text-sm font-medium">
                        {totalPortfolioValue > 0 ? ((totalCryptoValue / totalPortfolioValue) * 100).toFixed(1) : '0'}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-purple-500 rounded-full" 
                        style={{ width: `${totalPortfolioValue > 0 ? (totalCryptoValue / totalPortfolioValue) * 100 : 0}%` }} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="stocks" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="stocks">Acciones</TabsTrigger>
                <TabsTrigger value="crypto">Criptomonedas</TabsTrigger>
              </TabsList>
              
              <TabsContent value="stocks">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Portafolio de Acciones</CardTitle>
                      <CardDescription>
                        Haz seguimiento de tus inversiones en acciones y su rendimiento
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddStockOpen(true)} variant="secondary" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Añadir Acción
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {stocks.length > 0 ? (
                      <div className="rounded-md border">
                        <div className="grid grid-cols-7 bg-muted/50 p-3 text-sm font-medium">
                          <div>Símbolo</div>
                          <div className="col-span-2">Nombre</div>
                          <div className="text-right">Acciones</div>
                          <div className="text-right">Precio</div>
                          <div className="text-right">Valor</div>
                          <div className="text-right">Cambio</div>
                        </div>
                        <Separator />
                        <div>
                          {stocks.map((stock) => {
                            const value = stock.shares * stock.currentPrice;
                            return (
                              <div key={stock.id} className="grid grid-cols-7 p-3 text-sm hover:bg-muted/50">
                                <div className="font-medium">{stock.symbol}</div>
                                <div className="col-span-2">{stock.name}</div>
                                <div className="text-right">{stock.shares.toLocaleString()}</div>
                                <div className="text-right">₡{stock.currentPrice.toFixed(2)}</div>
                                <div className="text-right">₡{value.toFixed(2)}</div>
                                <div className={`text-right ${stock.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground mb-4">
                          Aún no has añadido ninguna acción a tu portafolio.
                        </p>
                        <Button onClick={() => setIsAddStockOpen(true)}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Añadir tu primera acción
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="crypto">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <div>
                      <CardTitle>Portafolio de Criptomonedas</CardTitle>
                      <CardDescription>
                        Haz seguimiento de tus inversiones en criptomonedas
                      </CardDescription>
                    </div>
                    <Button onClick={() => setIsAddCryptoOpen(true)} variant="secondary" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Añadir Criptomoneda
                    </Button>
                  </CardHeader>
                  <CardContent>
                    {cryptos.length > 0 ? (
                      <div className="rounded-md border">
                        <div className="grid grid-cols-7 bg-muted/50 p-3 text-sm font-medium">
                          <div>Símbolo</div>
                          <div className="col-span-2">Nombre</div>
                          <div className="text-right">Cantidad</div>
                          <div className="text-right">Precio</div>
                          <div className="text-right">Valor</div>
                          <div className="text-right">Cambio</div>
                        </div>
                        <Separator />
                        <div>
                          {cryptos.map((crypto) => {
                            const value = crypto.amount * crypto.currentPrice;
                            return (
                              <div key={crypto.id} className="grid grid-cols-7 p-3 text-sm hover:bg-muted/50">
                                <div className="font-medium">{crypto.symbol}</div>
                                <div className="col-span-2">{crypto.name}</div>
                                <div className="text-right">{crypto.amount.toLocaleString()}</div>
                                <div className="text-right">₡{crypto.currentPrice.toFixed(2)}</div>
                                <div className="text-right">₡{value.toFixed(2)}</div>
                                <div className={`text-right ${crypto.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                  {crypto.change >= 0 ? '+' : ''}{crypto.change.toFixed(2)}%
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <p className="text-muted-foreground mb-4">
                          Aún no has añadido ninguna criptomoneda a tu portafolio.
                        </p>
                        <Button onClick={() => setIsAddCryptoOpen(true)}>
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Añadir tu primera criptomoneda
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card className="p-8">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div>
                <h3 className="text-lg font-semibold">No hay inversiones</h3>
                <p className="text-muted-foreground mt-2">
                  Aún no has añadido ninguna inversión a tu portafolio.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button onClick={() => setIsAddStockOpen(true)} variant="outline">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Acción
                </Button>
                <Button onClick={() => setIsAddCryptoOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Criptomoneda
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Diálogo para Añadir Acción */}
      <Dialog open={isAddStockOpen} onOpenChange={setIsAddStockOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir Acción</DialogTitle>
            <DialogDescription>
              Añade una nueva acción a tu portafolio de inversiones.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockSymbol" className="text-right">
                Símbolo
              </Label>
              <Input
                id="stockSymbol"
                placeholder="AAPL"
                value={newStock.symbol}
                onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockName" className="text-right">
                Empresa
              </Label>
              <Input
                id="stockName"
                placeholder="Apple Inc."
                value={newStock.name}
                onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockShares" className="text-right">
                Acciones
              </Label>
              <Input
                id="stockShares"
                type="number"
                placeholder="10"
                value={newStock.shares}
                onChange={(e) => setNewStock({ ...newStock, shares: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="stockPrice" className="text-right">
                Precio de Compra
              </Label>
              <Input
                id="stockPrice"
                type="number"
                step="0.01"
                placeholder="150.00"
                value={newStock.buyPrice}
                onChange={(e) => setNewStock({ ...newStock, buyPrice: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddStockOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddStock}>Añadir Acción</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Añadir Criptomoneda */}
      <Dialog open={isAddCryptoOpen} onOpenChange={setIsAddCryptoOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir Criptomoneda</DialogTitle>
            <DialogDescription>
              Añade una nueva criptomoneda a tu portafolio.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cryptoSymbol" className="text-right">
                Símbolo
              </Label>
              <Input
                id="cryptoSymbol"
                placeholder="BTC"
                value={newCrypto.symbol}
                onChange={(e) => setNewCrypto({ ...newCrypto, symbol: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cryptoName" className="text-right">
                Nombre
              </Label>
              <Input
                id="cryptoName"
                placeholder="Bitcoin"
                value={newCrypto.name}
                onChange={(e) => setNewCrypto({ ...newCrypto, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cryptoAmount" className="text-right">
                Cantidad
              </Label>
              <Input
                id="cryptoAmount"
                type="number"
                step="0.000001"
                placeholder="0.5"
                value={newCrypto.amount}
                onChange={(e) => setNewCrypto({ ...newCrypto, amount: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="cryptoPrice" className="text-right">
                Precio de Compra
              </Label>
              <Input
                id="cryptoPrice"
                type="number"
                step="0.01"
                placeholder="35000"
                value={newCrypto.buyPrice}
                onChange={(e) => setNewCrypto({ ...newCrypto, buyPrice: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCryptoOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAddCrypto}>Añadir Criptomoneda</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Investments;
