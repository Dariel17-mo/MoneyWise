
import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 p-4">
      <div className="text-center max-w-md">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-prosperix-600 to-golden-500 flex items-center justify-center mx-auto mb-6">
          <span className="font-bold text-4xl text-white">P</span>
        </div>
        <h1 className="text-4xl font-bold heading-gradient mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! Esta pagina no funciona.
        </p>
        <Button asChild size="lg">
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Devuelvete a la página principal
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
