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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useUserSettings } from "@/context/UserSettingsContext";
import { 
  User, 
  Mail, 
  Lock, 
  Bell, 
  Sun, 
  Moon, 
  Smartphone, 
  Shield, 
  Globe, 
  Save
} from "lucide-react";

const Settings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { userSettings, updateSettings } = useUserSettings();
  const [isLoading, setIsLoading] = useState(false);
  
  const [profileSettings, setProfileSettings] = useState({
    name: userSettings.name || user?.name || "",
    email: userSettings.email || user?.email || "",
    phone: "",
  });
  
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    goalReminders: true,
    weeklyReports: true,
    newFeatures: false,
  });

  // Función para aplicar el tema al DOM
  const applyTheme = (theme) => {
    const root = document.documentElement;
    
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else if (theme === 'system') {
      // Detectar preferencia del sistema
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (systemPrefersDark) {
        root.classList.add('dark');
        root.classList.remove('light');
      } else {
        root.classList.add('light');
        root.classList.remove('dark');
      }
    }
  };

  // Función para aplicar vista compacta
  const applyCompactView = (isCompact) => {
    const root = document.documentElement;
    if (isCompact) {
      root.classList.add('compact-view');
      root.style.setProperty('--spacing-scale', '0.8');
      root.style.setProperty('--text-scale', '0.9');
    } else {
      root.classList.remove('compact-view');
      root.style.removeProperty('--spacing-scale');
      root.style.removeProperty('--text-scale');
    }
  };

  // Función para aplicar modo zen
  const applyZenMode = (isZen) => {
    const root = document.documentElement;
    if (isZen) {
      root.classList.add('zen-mode');
      // Estilos para modo zen
      root.style.setProperty('--border-radius', '12px');
      root.style.setProperty('--shadow-intensity', '0.05');
      root.style.setProperty('--animation-speed', '0.2s');
    } else {
      root.classList.remove('zen-mode');
      root.style.removeProperty('--border-radius');
      root.style.removeProperty('--shadow-intensity');
      root.style.removeProperty('--animation-speed');
    }
  };

  // Aplicar configuraciones al cargar el componente
  useEffect(() => {
    if (userSettings.theme) {
      applyTheme(userSettings.theme);
    }
    if (userSettings.compactView !== undefined) {
      applyCompactView(userSettings.compactView);
    }
    if (userSettings.zenMode !== undefined) {
      applyZenMode(userSettings.zenMode);
    }

    // Listener para cambios en preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      if (userSettings.theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, [userSettings]);
  
  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Update the user settings context
    updateSettings({
      name: profileSettings.name,
      email: profileSettings.email
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Perfil actualizado",
        description: "La información de tu perfil ha sido actualizada.",
      });
    }, 500);
  };
  
  const handleNotificationChange = (key, value) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: value,
    });
    
    toast({
      title: "Configuración actualizada",
      description: "Tu preferencia de notificaciones ha sido guardada.",
    });
  };
  
  const handleAppearanceChange = (key, value) => {
    // Actualizar el contexto primero
    updateSettings({
      [key]: value,
    });

    // Aplicar cambios inmediatamente al DOM
    if (key === "theme") {
      applyTheme(value);
      toast({
        title: "Tema actualizado",
        description: `Tema cambiado a ${value === 'light' ? 'claro' : value === 'dark' ? 'oscuro' : 'sistema'}.`,
      });
    } else if (key === "compactView") {
      applyCompactView(value);
      toast({
        title: "Vista actualizada",
        description: `Vista ${value ? 'compacta' : 'normal'} activada.`,
      });
    } else if (key === "zenMode") {
      applyZenMode(value);
      toast({
        title: "Modo actualizado",
        description: `Modo zen ${value ? 'activado' : 'desactivado'}.`,
      });
    }
  };
  
  const handleCurrencyChange = (currency) => {
    let currencySymbol = "₡";
    
    if (currency === "USD") currencySymbol = "$";
    else if (currency === "EUR") currencySymbol = "€";
    else if (currency === "GBP") currencySymbol = "£";
    else if (currency === "CAD") currencySymbol = "C$";
    else if (currency === "AUD") currencySymbol = "A$";
    
    updateSettings({
      currency,
      currencySymbol
    });
    
    toast({
      title: "Moneda actualizada",
      description: `Tu moneda predeterminada ha sido actualizada a ${currency}.`,
    });
  };
  
  const handleSecurityChange = (key, value) => {
    toast({
      title: "Configuración de seguridad actualizada",
      description: "Tu preferencia de seguridad ha sido guardada.",
    });
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
        <p className="text-muted-foreground">
          Administra la configuración y preferencias de tu cuenta
        </p>
        
        <Tabs defaultValue="appearance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="appearance">
              <Sun className="h-4 w-4 mr-2" />
              Apariencia
            </TabsTrigger>
          </TabsList>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Notificaciones</CardTitle>
                <CardDescription>
                  Elige cómo quieres recibir notificaciones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notificaciones</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones por correo electrónico
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.emailNotifications} 
                      onCheckedChange={(checked) => handleNotificationChange("emailNotifications", checked)} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Notificaciones Push</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones push en tus dispositivos
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.pushNotifications} 
                      onCheckedChange={(checked) => handleNotificationChange("pushNotifications", checked)} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Alertas de Presupuesto</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe alertas cuando estés cerca de superar tu presupuesto
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.budgetAlerts} 
                      onCheckedChange={(checked) => handleNotificationChange("budgetAlerts", checked)} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Recordatorios de Meta</Label>
                      <p className="text-sm text-muted-foreground">
                        Recordatorios sobre tus metas financieras
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.goalReminders} 
                      onCheckedChange={(checked) => handleNotificationChange("goalReminders", checked)} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Reportes Semanales</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe resúmenes financieros semanales
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.weeklyReports} 
                      onCheckedChange={(checked) => handleNotificationChange("weeklyReports", checked)} 
                    />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Nuevas Características</Label>
                      <p className="text-sm text-muted-foreground">
                        Recibe notificaciones sobre nuevas características y actualizaciones
                      </p>
                    </div>
                    <Switch 
                      checked={notificationSettings.newFeatures} 
                      onCheckedChange={(checked) => handleNotificationChange("newFeatures", checked)} 
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Appearance Settings - SECCIÓN COMPLETAMENTE FUNCIONAL */}
          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Apariencia</CardTitle>
                <CardDescription>
                  Personaliza cómo MoneyWise se ve y se siente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-base font-medium">Preferencia de Tema</Label>
                  <p className="text-sm text-muted-foreground mb-3">
                    Selecciona tu tema preferido para la aplicación
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button 
                      variant={userSettings.theme === "light" ? "default" : "outline"}
                      onClick={() => handleAppearanceChange("theme", "light")}
                      className="flex items-center gap-2 min-w-[100px] transition-all duration-200"
                    >
                      <Sun className="h-4 w-4" />
                      Claro
                    </Button>
                    <Button 
                      variant={userSettings.theme === "dark" ? "default" : "outline"}
                      onClick={() => handleAppearanceChange("theme", "dark")}
                      className="flex items-center gap-2 min-w-[100px] transition-all duration-200"
                    >
                      <Moon className="h-4 w-4" />
                      Oscuro
                    </Button>
                    <Button 
                      variant={userSettings.theme === "system" ? "default" : "outline"}
                      onClick={() => handleAppearanceChange("theme", "system")}
                      className="flex items-center gap-2 min-w-[100px] transition-all duration-200"
                    >
                      <Smartphone className="h-4 w-4" />
                      Sistema
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {userSettings.theme === "system" 
                      ? "Se ajusta automáticamente según tu preferencia del sistema" 
                      : `Tema ${userSettings.theme === "light" ? "claro" : "oscuro"} seleccionado`
                    }
                  </p>
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Modo Zen</Label>
                      <p className="text-sm text-muted-foreground">
                        Interfaz simplificada y relajante para reducir el estrés financiero
                      </p>
                    </div>
                    <Switch 
                      checked={userSettings.zenMode || false} 
                      onCheckedChange={(checked) => handleAppearanceChange("zenMode", checked)} 
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Vista Compacta</Label>
                      <p className="text-sm text-muted-foreground">
                        Muestra más información en pantalla con espaciado reducido
                      </p>
                    </div>
                    <Switch 
                      checked={userSettings.compactView || false} 
                      onCheckedChange={(checked) => handleAppearanceChange("compactView", checked)} 
                    />
                  </div>
                </div>

                {/* Preview de los cambios actuales */}
                <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-dashed">
                  <h4 className="text-sm font-medium mb-2">Vista actual:</h4>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      userSettings.theme === 'dark' ? 'bg-slate-800 text-slate-200' :
                      userSettings.theme === 'light' ? 'bg-slate-100 text-slate-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {userSettings.theme === 'dark' ? '🌙 Oscuro' :
                       userSettings.theme === 'light' ? '☀️ Claro' :
                       '🔄 Sistema'}
                    </span>
                    {userSettings.zenMode && (
                      <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                        🧘 Zen
                      </span>
                    )}
                    {userSettings.compactView && (
                      <span className="px-2 py-1 rounded-full bg-purple-100 text-purple-800">
                        📱 Compacto
                      </span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
        </Tabs>
      </div>

      {/* CSS adicional para los modos */}
      <style jsx global>{`
        .compact-view {
          --spacing-unit: 0.5rem;
        }
        .compact-view .space-y-4 > * + * {
          margin-top: calc(var(--spacing-unit) * 0.8);
        }
        .compact-view .space-y-6 > * + * {
          margin-top: calc(var(--spacing-unit) * 1.2);
        }
        
        .zen-mode {
          --zen-primary: hsl(142, 76%, 36%);
          --zen-secondary: hsl(142, 76%, 90%);
        }
        .zen-mode .border {
          border-color: var(--zen-secondary);
        }
        .zen-mode [data-state="checked"] {
          background-color: var(--zen-primary);
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Settings;
