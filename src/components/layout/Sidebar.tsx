
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  CircleDollarSign,
  PieChart,
  Target,
  LineChart,
  FileText,
  Settings,
  Info,
  Leaf,
  BarChart4,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { label: "Panel", href: "/", icon: Home },
  { label: "Transacciones", href: "/transactions", icon: CircleDollarSign },
  { label: "Presupuestos", href: "/budgets", icon: PieChart },
  { label: "Objetivos", href: "/goals", icon: Target },
  { label: "Inversiones", href: "/investments", icon: LineChart },
  { label: "Documentos", href: "/documents", icon: FileText },
  { label: "Informes", href: "/reports", icon: BarChart4 },
  { label: "Modo Zen", href: "/zen", icon: Leaf },
  { divider: true },
  { label: "Configuración", href: "/settings", icon: Settings },
  { label: "Acerca de", href: "/about", icon: Info },
];

const Sidebar: React.FC<SidebarProps> = ({
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  if (isMobile && !isSidebarOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay para móvil */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside
        className={`${
          isMobile
            ? "fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-200 ease-in-out"
            : "hidden md:block w-64 border-r"
        } bg-card`}
      >
        <div className="flex flex-col h-full">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <img
              src="./src/components/img/LOGO_MONEYWISE.png"
              alt="MoneyWise"
              className="h-27 w-46 mt-4"
            />
            {/* Botón X para cerrar - solo visible en móvil */}
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Cerrar menú</span>
              </Button>
            )}
          </div>
          <br />
          <nav className="flex-1 overflow-y-auto space-y-1 px-3 pt-2">
            <ul className="space-y-2">
              {navItems.map((item, i) =>
                item.divider ? (
                  <li key={`divider-${i}`} className="my-4 border-t" />
                ) : (
                  <li key={item.href}>
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-accent hover:text-accent-foreground"
                        }`
                      }
                      onClick={() => isMobile && setIsSidebarOpen(false)}
                    >
                      {item.icon && <item.icon className="h-4 w-4" />}
                      {item.label}
                    </NavLink>
                  </li>
                )
              )}
              <li className="pt-4">
                <div className="flex justify-center">
                  <a
                    href="https://wa.me/+50672862183"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer hover:opacity-75 transition-opacity"
                  >
                    <img
                      src="./src/components/img/LOGO_COMPAÑIA.png"
                      alt="MoneyWise"
                      className="h-25 w-auto"
                    />
                  </a>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
