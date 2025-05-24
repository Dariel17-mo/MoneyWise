
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getData, saveData } from './storageService';
import { Goal } from '@/types/models';

/**
 * Obtiene todas las metas
 */
export const getAllGoals = (): Goal[] => {
  return getData<Goal[]>(STORAGE_KEYS.GOALS, []);
};

/**
 * Añade una nueva meta
 */
export const addGoal = (goal: Omit<Goal, 'id'>): Goal => {
  const newGoal = {
    ...goal,
    id: uuidv4()
  };
  
  const goals = getAllGoals();
  goals.push(newGoal);
  
  saveData(STORAGE_KEYS.GOALS, goals);
  
  return newGoal;
};

/**
 * Actualiza una meta existente
 */
export const updateGoal = (updatedGoal: Goal): Goal => {
  const goals = getAllGoals();
  const index = goals.findIndex(g => g.id === updatedGoal.id);
  
  if (index !== -1) {
    goals[index] = updatedGoal;
    saveData(STORAGE_KEYS.GOALS, goals);
    return updatedGoal;
  }
  
  throw new Error(`No se encontró la meta con id: ${updatedGoal.id}`);
};

/**
 * Elimina una meta
 */
export const deleteGoal = (id: string): void => {
  const goals = getAllGoals();
  const filteredGoals = goals.filter(g => g.id !== id);
  
  saveData(STORAGE_KEYS.GOALS, filteredGoals);
};

/**
 * Añade fondos a una meta
 */
export const addFundsToGoal = (id: string, amount: number): Goal => {
  const goals = getAllGoals();
  const index = goals.findIndex(g => g.id === id);
  
  if (index !== -1) {
    goals[index].currentAmount += amount;
    saveData(STORAGE_KEYS.GOALS, goals);
    return goals[index];
  }
  
  throw new Error(`No se encontró la meta con id: ${id}`);
};
