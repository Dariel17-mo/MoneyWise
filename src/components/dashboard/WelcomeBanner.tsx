
import React from "react";
import { ArrowUpCircle, PieChart, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function WelcomeBanner() {
  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días!";
    if (hour < 18) return "Buenas tardes!";
    return "Buenas noches!";
  };

  // Format current date in Spanish
  const currentDate = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date());

  return (
    <div className="glass-card relative overflow-hidden p-6 md:p-8 backdrop-blur-md">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-green-500/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">{currentDate}</p>
          <h1 className="text-3xl font-bold heading-gradient mb-2">
            {getGreeting()}
          </h1>
          <p className="text-muted-foreground max-w-lg">
            Bienvenido a tu panel financiero personal. Aquí podrás gestionar y visualizar todas tus finanzas en un solo lugar.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-90 transition-opacity flex items-center" asChild>
            <Link to="/transactions">
              <ArrowUpCircle className="mr-2 h-4 w-4" />
              Añadir Transacción
            </Link>
          </Button>
          <Button variant="outline" className="flex items-center" asChild>
            <Link to="/reports">
              <PieChart className="mr-2 h-4 w-4" />
              Informe Financiero
            </Link>
          </Button>
         
        </div>
      </div>
    </div>
  );
}
