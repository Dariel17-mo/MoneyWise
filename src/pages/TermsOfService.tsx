
import React from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
          <h1 className="text-3xl font-bold mb-6">Términos de Servicio</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Última actualización: 21 de mayo de 2025</p>

          <div className="prose dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
              <p className="mb-4">
                Bienvenido a MoneyWise. Estos Términos de Servicio rigen su uso de nuestra aplicación de gestión financiera y sitio web.
              </p>
              <p>
                Al acceder o utilizar MoneyWise, usted acepta estar sujeto a estos Términos. Si no está de acuerdo con alguna parte de los Términos, no tiene permiso para acceder a la aplicación.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. Definiciones</h2>
              <ul className="list-disc pl-6">
                <li><strong>Aplicación</strong> se refiere a MoneyWise.</li>
                <li><strong>Servicio</strong> se refiere a la aplicación.</li>
                <li><strong>Usted</strong> se refiere al individuo que accede o utiliza la aplicación, o la empresa u otra entidad legal en nombre de la cual dicho individuo está accediendo o utilizando la aplicación.</li>
                <li><strong>Nosotros</strong>, <strong>Nos</strong>, o <strong>Nuestro</strong> se refiere a INFINICORE WEB WORKS, el operador y desarrollador de MoneyWise.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3.Cuenta</h2>
              <p className="mb-4">
                Cuando utilize su cuenta, debe proporcionar información precisa y completa. Usted es responsable de todas las actividades que ocurran bajo su cuenta. Acepta notificarnos inmediatamente cualquier uso no autorizado de su cuenta.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Servicio Gratuito</h2>
              <p className="mb-4">
                MoneyWise se proporciona actualmente como un servicio gratuito. Nos reservamos el derecho de cambiar esto en el futuro, pero siempre proporcionaremos una notificación clara antes de implementar cualquier cambio en nuestra estructura de tarifas.
              </p>
              <p>
                Si decidimos implementar tarifas en el futuro, tendrá la opción de continuar usando las funciones gratuitas o actualizar a los servicios de pago.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">5. Datos del Usuario</h2>
              <p className="mb-4">
                Usted mantiene la propiedad completa de todos los datos que ingresa en MoneyWise. No reclamamos derechos de propiedad sobre sus datos financieros.
              </p>
              <p>
                Usted es el único responsable de la precisión de la información financiera que ingresa en la aplicación.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">6. Uso Aceptable</h2>
              <p className="mb-4">
                Usted acepta no usar MoneyWise:
              </p>
              <ul className="list-disc pl-6">
                <li>De cualquier manera que viole cualquier ley o regulación federal, estatal, local o internacional aplicable</li>
                <li>Para transmitir, o procurar el envío de, cualquier material publicitario o promocional sin nuestro consentimiento previo</li>
                <li>Para hacerse pasar por o intentar hacerse pasar por otra persona o entidad</li>
                <li>Para participar en cualquier otra conducta que restrinja o inhiba el uso o disfrute del servicio por parte de cualquier persona</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">7. Renuncia de Garantías</h2>
              <p className="mb-4">
                Su uso de MoneyWise es bajo su propio riesgo. El servicio se proporciona "TAL COMO ESTÁ" y "SEGÚN DISPONIBILIDAD". Renunciamos expresamente a todas las garantías de cualquier tipo, ya sean expresas o implícitas.
              </p>
              <p>
                MoneyWise no es un sustituto del asesoramiento financiero profesional. Recomendamos consultar con un asesor financiero profesional para decisiones financieras importantes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">8. Limitación de Responsabilidad</h2>
              <p>
                En ningún caso seremos responsables por daños indirectos, incidentales, especiales, consecuentes o punitivos, incluyendo sin limitación, pérdida de ganancias, datos, uso, buena voluntad u otras pérdidas intangibles, resultantes de su acceso o uso o incapacidad de acceder o usar el servicio.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">9. Cambios a los Términos</h2>
              <p>
                Nos reservamos el derecho de modificar estos Términos en cualquier momento. Proporcionaremos aviso de cualquier cambio significativo. Su uso continuado de MoneyWise después de dichas modificaciones constituirá su reconocimiento de los Términos modificados.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">10. Contáctanos</h2>
              <p>
                Si tiene alguna pregunta sobre estos Términos, por favor contáctenos por medio de correo electronico InfiniCore@hotmail.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TermsOfService;
