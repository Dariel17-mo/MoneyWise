
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TrashIcon, EditIcon, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useUserSettings } from "@/context/UserSettingsContext";

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}

interface TransactionListProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  onEdit?: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onDelete,
  onEdit,
}) => {
  const { userSettings } = useUserSettings();
  const { currencySymbol } = userSettings;

  if (transactions.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No se encontraron transacciones.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead className="text-right">Importe</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{format(new Date(transaction.date), 'dd MMM, yyyy', { locale: es })}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  {transaction.type === 'income' ? (
                    <ArrowUpCircle className="h-4 w-4 text-emerald-500 mr-2" />
                  ) : (
                    <ArrowDownCircle className="h-4 w-4 text-rose-500 mr-2" />
                  )}
                  <span>{transaction.description}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="inline-block px-2 py-1 text-xs rounded-md bg-gray-100 dark:bg-gray-800">
                  {transaction.category}
                </span>
              </TableCell>
              <TableCell className={`text-right font-medium ${
                transaction.type === 'income' 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-rose-600 dark:text-rose-400'
              }`}>
                {transaction.type === 'income' ? '+' : '-'}
                {currencySymbol}{transaction.amount.toFixed(2)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onEdit && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => onEdit(transaction)}
                        >
                          <EditIcon className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Editar transacción</TooltipContent>
                    </Tooltip>
                  )}
                  
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onDelete(transaction.id)}
                      >
                        <TrashIcon className="h-4 w-4 text-rose-500" />
                        <span className="sr-only">Eliminar</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Eliminar transacción</TooltipContent>
                  </Tooltip>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
