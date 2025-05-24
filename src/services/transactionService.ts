
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getData, saveData } from './storageService';
import { Transaction } from '@/types/models';

/**
 * Obtiene todas las transacciones
 */
export const getAllTransactions = (): Transaction[] => {
  return getData<Transaction[]>(STORAGE_KEYS.TRANSACTIONS, []);
};

/**
 * Añade una nueva transacción
 */
export const addTransaction = (transaction: Omit<Transaction, 'id'>): Transaction => {
  const newTransaction = {
    ...transaction,
    id: uuidv4()
  };
  
  const transactions = getAllTransactions();
  transactions.unshift(newTransaction); // Añadimos al principio para mostrar primero las más recientes
  
  saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
  
  return newTransaction;
};

/**
 * Actualiza una transacción existente
 */
export const updateTransaction = (updatedTransaction: Transaction): Transaction => {
  const transactions = getAllTransactions();
  const index = transactions.findIndex(t => t.id === updatedTransaction.id);
  
  if (index !== -1) {
    transactions[index] = updatedTransaction;
    saveData(STORAGE_KEYS.TRANSACTIONS, transactions);
    return updatedTransaction;
  }
  
  throw new Error(`No se encontró la transacción con id: ${updatedTransaction.id}`);
};

/**
 * Elimina una transacción
 */
export const deleteTransaction = (id: string): void => {
  const transactions = getAllTransactions();
  const filteredTransactions = transactions.filter(t => t.id !== id);
  
  saveData(STORAGE_KEYS.TRANSACTIONS, filteredTransactions);
};

/**
 * Calcula el total de ingresos
 */
export const calculateTotalIncome = (): number => {
  return getAllTransactions()
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calcula el total de gastos
 */
export const calculateTotalExpense = (): number => {
  return getAllTransactions()
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Calcula el balance neto (ingresos - gastos)
 */
export const calculateNetBalance = (): number => {
  return calculateTotalIncome() - calculateTotalExpense();
};
