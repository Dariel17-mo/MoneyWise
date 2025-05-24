
import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4 max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/about" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Acerca de
            </Link>
          </Button>
        </div>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6">Política de Privacidad</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Última actualización: 21 de mayo de 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
              <p className="mb-4">
                En MoneyWise, nos tomamos su privacidad muy en serio. Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando utiliza nuestra aplicación de gestión financiera.
              </p>
              <p>
                Por favor, lea esta Política de Privacidad cuidadosamente. Al acceder y utilizar MoneyWise, usted reconoce que ha leído y comprendido esta Política de Privacidad.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Información que Recopilamos</h2>
              <p className="mb-4">
                Recopilamos información que usted nos proporciona voluntariamente cuando se registra en MoneyWise, incluyendo:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Datos financieros que usted ingresa en la aplicación</li>
              </ul>
              <p>
                No recopilamos ni almacenamos sus credenciales bancarias.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Cómo Utilizamos su Información</h2>
              <p className="mb-4">Utilizamos la información que recopilamos para:</p>
              <ul className="list-disc pl-6">
                <li>Proporcionar, mantener y mejorar MoneyWise</li>
                <li>Procesar y completar transacciones</li>
                <li>Enviarle avisos técnicos y mensajes de soporte</li>
                <li>Responder a sus comentarios y preguntas</li>
                <li>Analizar patrones de uso para mejorar nuestro servicio</li>
                <li>Proteger, identificar y prevenir fraude y otras actividades ilegales</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Seguridad de Datos</h2>
              <p className="mb-4">
                Implementamos medidas técnicas y organizacionales apropiadas para proteger sus datos personales contra el procesamiento no autorizado o ilegal, pérdida accidental, destrucción o daño. Estas medidas incluyen:
              </p>
              <ul className="list-disc pl-6">
                <li>Cifrado de datos sensibles</li>
                <li>Evaluaciones regulares de seguridad</li>
                <li>Controles de acceso para limitar el acceso a datos al personal autorizado</li>
                <li>Prácticas seguras de almacenamiento de datos</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Compartición y Divulgación de Datos</h2>
              <p className="mb-4">
                No vendemos, intercambiamos ni transferimos de otra manera su información personal a terceros. Podemos compartir su información con:
              </p>
              <ul className="list-disc pl-6">
                
                <li>Autoridades policiales u otras entidades gubernamentales si es requerido por ley</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Sus Derechos</h2>
              <p className="mb-4">Usted tiene el derecho a:</p>
              <ul className="list-disc pl-6">
                <li>Acceder a la información personal que tenemos sobre usted</li>
                <li>Solicitar la corrección de información personal inexacta</li>
                <li>Solicitar la eliminación de su información personal</li>
                <li>Oponerse al procesamiento de su información personal</li>
                <li>Solicitar la restricción del procesamiento de su información personal</li>
                <li>Solicitar la transferencia de su información personal</li>
                <li>Retirar el consentimiento en cualquier momento</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Cambios a esta Política de Privacidad</h2>
              <p>
                Podemos actualizar esta Política de Privacidad de vez en cuando. Le notificaremos de cualquier cambio publicando la nueva Política de Privacidad en esta página y actualizando la fecha de "Última actualización". Se le aconseja revisar esta Política de Privacidad periódicamente para cualquier cambio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Contáctanos</h2>
              <p>
                Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos por medio de correo electronico InfiniCore@hotmail.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrivacyPolicy;