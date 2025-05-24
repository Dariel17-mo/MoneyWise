
// Tipos comunes para toda la aplicación

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  notes: string;
}

export interface Budget {
  id: string;
  name: string;
  limit: number;
  spent: number;
  category: string;
  period: string;
  color: string;
}

export interface Goal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date | string;
  category: string;
  priority: string;
  notes: string;
}

export interface Document {
  id: string;
  name: string;
  type: string;
  date: string;
  size: string;
  icon: string;
}
