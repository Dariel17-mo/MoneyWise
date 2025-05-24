import React from "react";
import { Menu, Bell, Sun, Moon, Search, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const navigate = useNavigate();
  // Estado para el modo oscuro
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    // Verificar si hay una preferencia guardada o usar la preferencia del sistema
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Si no hay preferencia guardada, usar la del sistema
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Efecto para aplicar el tema al documento
  React.useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Detectar cambios en la preferencia del sistema
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo cambiar si no hay preferencia manual guardada
      const savedTheme = localStorage.getItem('theme');
      if (!savedTheme || savedTheme === 'system') {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const useSystemTheme = () => {
    localStorage.setItem('theme', 'system');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(systemPrefersDark);
  };

  const openSystemSettings = () => {
    navigate('/settings');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center mr-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-2 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Alternar menú</span>
            </Button>
          )}
        </div>

        <div className="hidden md:flex items-center flex-1 gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar..."
              className="w-full pl-8 bg-background"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notificaciones</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-muted-foreground">
                {isDarkMode ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
                <span className="sr-only">Cambiar tema</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem 
                onClick={toggleDarkMode}
                className="flex items-center gap-2"
              >
                {isDarkMode ? (
                  <>
                    <Sun className="h-4 w-4" />
                    Modo claro
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" />
                    Modo oscuro
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={openSystemSettings}
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configuración del sistema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
