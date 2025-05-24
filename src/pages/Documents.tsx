
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileUp,
  FileText,
  File,
  Receipt,
  FileSearch,
  Download,
  Trash2,
  Plus,
  FileSpreadsheet,
  Image,
  FilePieChart,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Document } from "@/types/models";
import {
  getAllDocuments,
  addDocument as addDocumentService,
  deleteDocument as deleteDocumentService
} from "@/services/documentService";

// Mapping for document types to icons
const documentIcons: Record<string, any> = {
  "receipt": Receipt,
  "bill": FileText,
  "statement": FileText,
  "tax": FilePieChart,
  "insurance": FileText,
  "budget": FileSpreadsheet,
  "other": File
};

const Documents = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadDetails, setUploadDetails] = useState({
    name: "",
    type: "receipt",
  });
  const { toast } = useToast();
  
  useEffect(() => {
    loadDocuments();
  }, []);
  
  const loadDocuments = () => {
    const loadedDocuments = getAllDocuments();
    setDocuments(loadedDocuments);
  };
  
  const documentTypes = ["all", "receipt", "bill", "statement", "tax", "insurance", "budget"];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setUploadDetails({
        ...uploadDetails,
        name: selectedFile.name,
      });
    }
  };
  
  const handleUpload = () => {
    if (!file) {
      toast({
        title: "Ningún archivo seleccionado",
        description: "Por favor selecciona un archivo para subir.",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadDetails.name) {
      toast({
        title: "Información incompleta",
        description: "Por favor proporciona un nombre para el documento.",
        variant: "destructive",
      });
      return;
    }
    
    // En una app real, aquí subirías el archivo a un servidor
    const newDocumentData = {
      name: uploadDetails.name,
      type: uploadDetails.type,
      date: new Date().toISOString().split("T")[0],
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      icon: uploadDetails.type,
    };
    
    addDocumentService(newDocumentData);
    loadDocuments();
    
    setFile(null);
    setUploadDetails({
      name: "",
      type: "receipt",
    });
    
    toast({
      title: "Documento subido",
      description: "Tu documento ha sido subido exitosamente.",
    });
  };
  
  const deleteDocument = (id: string) => {
    deleteDocumentService(id);
    loadDocuments();
    
    toast({
      title: "Documento eliminado",
      description: "El documento ha sido eliminado.",
    });
  };
  
  const filterDocuments = (type: string) => {
    let filtered = documents;
    
    if (type !== "all") {
      filtered = documents.filter(doc => doc.type === type);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  };
  
  // Función para formatear fechas
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, 'dd MMM, yyyy', { locale: es });
  };
  
  // Traducción de los tipos de documentos
  const getDocumentTypeLabel = (type: string) => {
    const typeLabels: Record<string, string> = {
      all: "Todos",
      receipt: "Recibos",
      bill: "Facturas",
      statement: "Estados de Cuenta",
      tax: "Impuestos",
      insurance: "Seguros",
      budget: "Presupuestos"
    };
    
    return typeLabels[type] || type;
  };
  
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
            <p className="text-muted-foreground">
              Sube y gestiona tus documentos financieros
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sección de Subida */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Subir Documento</CardTitle>
              <CardDescription>
                Sube tus recibos, facturas u otros documentos financieros
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="document">Archivo de Documento</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="document"
                      type="file"
                      className="cursor-pointer"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Formatos soportados: PDF, JPG, PNG, DOCX
                  </p>
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="docName">Nombre del Documento</Label>
                  <Input
                    id="docName"
                    placeholder="Ej: Factura de Luz Mayo"
                    value={uploadDetails.name}
                    onChange={(e) => setUploadDetails({...uploadDetails, name: e.target.value})}
                  />
                </div>
                
                <div className="grid w-full items-center gap-1.5">
                  <Label htmlFor="docType">Tipo de Documento</Label>
                  <select
                    id="docType"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={uploadDetails.type}
                    onChange={(e) => setUploadDetails({...uploadDetails, type: e.target.value})}
                  >
                    <option value="receipt">Recibo</option>
                    <option value="bill">Factura</option>
                    <option value="statement">Estado de Cuenta</option>
                    <option value="tax">Documento Fiscal</option>
                    <option value="insurance">Seguro</option>
                    <option value="budget">Presupuesto</option>
                  </select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpload} className="w-full">
                <FileUp className="mr-2 h-4 w-4" />
                Subir Documento
              </Button>
            </CardFooter>
          </Card>
          
          {/* Sección de Lista de Documentos */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle>Tus Documentos</CardTitle>
                  <div className="w-full sm:w-64">
                    <Input
                      placeholder="Buscar documentos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs defaultValue="all">
                  <div className="px-6">
                    <TabsList className="w-full overflow-x-auto">
                      {documentTypes.map(type => (
                        <TabsTrigger key={type} value={type}>
                          {getDocumentTypeLabel(type)}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </div>
                  
                  {documentTypes.map((type) => (
                    <TabsContent key={type} value={type}>
                      <div className="divide-y">
                        {filterDocuments(type).length > 0 ? (
                          filterDocuments(type).map((doc) => {
                            const IconComponent = documentIcons[doc.icon] || File;
                            return (
                              <div
                                key={doc.id}
                                className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                              >
                                <div className="flex items-center space-x-4">
                                  <div className="bg-primary/10 p-2 rounded-lg">
                                    <IconComponent className="h-6 w-6 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{doc.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {formatDate(doc.date)} • {doc.size}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="icon">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => deleteDocument(doc.id)}
                                  >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <FileSearch className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground mb-2">No se encontraron documentos</p>
                            {type !== "all" ? (
                              <p className="text-sm text-muted-foreground">
                                No tienes documentos de tipo {getDocumentTypeLabel(type).toLowerCase()} aún.
                              </p>
                            ) : searchQuery ? (
                              <p className="text-sm text-muted-foreground">
                                Ningún documento coincide con tu búsqueda.
                              </p>
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                Sube tu primer documento para comenzar.
                              </p>
                            )}
                            <Button 
                              variant="outline" 
                              className="mt-4"
                              onClick={() => document.getElementById("document")?.click()}
                            >
                              <Plus className="mr-2 h-4 w-4" />
                              Subir un Documento
                            </Button>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Documents;
