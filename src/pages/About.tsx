
import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

const About = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-800 bg-clip-text text-transparent">
            Acerca de MoneyWise
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Su solución de gestión financiera personal 100% gratuita
          </p>
        </div>

        <div className="space-y-12">
          <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Nuestra Misión</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              MoneyWise fue creado con una misión simple: hacer que las herramientas de gestión financiera de nivel profesional sean accesibles para todos, independientemente de su situación financiera. Creemos que la educación financiera y la gestión adecuada del dinero no deben estar limitadas por la capacidad de alguien para pagar un software costoso.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Por eso MoneyWise es y siempre será 100% gratuito de usar. Sin tarifas ocultas, sin características premium, sin venta de datos — solo una herramienta poderosa para ayudarte a tomar control de tus finanzas.
            </p>
          </section>

          <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Características Principales</h2>
            <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
              <li>Panel inteligente con perspectivas personalizadas</li>
              <li>Seguimiento integral de ingresos y gastos</li>
              <li>Creación y gestión de presupuestos</li>
              <li>Establecimiento y seguimiento de metas financieras</li>
              <li>Monitoreo de cartera de inversiones</li>
              <li>Herramientas de gestión de deudas</li>
              <li>Hermosas visualizaciones de datos e informes</li>
              <li>Gestión de documentos para registros financieros</li>
              <li>Modo Zen para gestión financiera sin estrés</li>
              <li>Seguridad de nivel bancario para sus datos</li>
            </ul>
          </section>

          <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Privacidad y Seguridad</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nos tomamos muy en serio su privacidad y la seguridad de sus datos financieros. MoneyWise implementa cifrado y medidas de seguridad de nivel bancario para asegurar que su información esté protegida en todo momento.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              No vendemos sus datos a terceros ni los utilizamos para propósitos de marketing. Su información financiera le pertenece a usted y solo a usted.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button variant="outline" asChild>
                <Link to="/privacy">Política de Privacidad <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/terms">Términos de Servicio <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-6">Conoce al Desarrollador</h2>
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-white rounded-full mb-6 flex items-center justify-center p-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-blue-900/20">
                <img
                  src="/img/LOGO_COMPAÑIA.png"
                  alt="INFINICORE WEB WORKS Logo"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <h3 className="text-xl font-bold">INFINICORE WEB WORKS</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Soluciones Digitales🚀</p>
              <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto mb-6">
                MoneyWise fue creado como un proyecto de demostración para mostrar habilidades de desarrollo web de alta calidad y una pasión por crear herramientas útiles y accesibles para todos.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" asChild>
                  <a href="https://wa.me/+50672862183" target="_blank" rel="noopener noreferrer">
                    Whatsapp
                  </a>
                </Button>
                
                <Button variant="outline" asChild>
                  <a href="mailto:InfiniCore@hotmail.com" >
                    Correo electronico
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </div>

        <div className="text-center mt-16">
          <Button asChild>
            <Link to="/">Comience a Gestionar sus Finanzas</Link>
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default About;
