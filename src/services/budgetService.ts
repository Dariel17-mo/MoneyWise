import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getData, saveData } from './storageService';
import { Budget } from '@/types/models';
import { getAllTransactions } from './transactionService';

/**
 * Obtiene todos los presupuestos
 */
export const getAllBudgets = (): Budget[] => {
  return getData<Budget[]>(STORAGE_KEYS.BUDGETS, []);
};

/**
 * Añade un nuevo presupuesto
 */
export const addBudget = (budget: Omit<Budget, 'id' | 'spent'>): Budget => {
  const newBudget = {
    ...budget,
    id: uuidv4(),
    spent: calculateCurrentSpent(budget.category)
  };
  
  const budgets = getAllBudgets();
  budgets.push(newBudget);
  
  saveData(STORAGE_KEYS.BUDGETS, budgets);
  
  return newBudget;
};

/**
 * Actualiza un presupuesto existente
 */
export const updateBudget = (updatedBudget: Budget): Budget => {
  const budgets = getAllBudgets();
  const index = budgets.findIndex(b => b.id === updatedBudget.id);
  
  if (index !== -1) {
    budgets[index] = updatedBudget;
    saveData(STORAGE_KEYS.BUDGETS, budgets);
    return updatedBudget;
  }
  
  throw new Error(`No se encontró el presupuesto con id: ${updatedBudget.id}`);
};

/**
 * Elimina un presupuesto
 */
export const deleteBudget = (id: string): void => {
  const budgets = getAllBudgets();
  const filteredBudgets = budgets.filter(b => b.id !== id);
  
  saveData(STORAGE_KEYS.BUDGETS, filteredBudgets);
};

/**
 * Calcula lo gastado actualmente para una categoría
 */
export const calculateCurrentSpent = (category: string): number => {
  const transactions = getAllTransactions();
  
  // Filtramos transacciones por categoría y tipo (solo gastos)
  return transactions
    .filter(t => t.category === category && t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Actualiza los montos gastados para todos los presupuestos
 */
export const updateAllBudgetsSpent = (): void => {
  const budgets = getAllBudgets();
  
  const updatedBudgets = budgets.map(budget => ({
    ...budget,
    spent: calculateCurrentSpent(budget.category)
  }));
  
  saveData(STORAGE_KEYS.BUDGETS, updatedBudgets);
};
