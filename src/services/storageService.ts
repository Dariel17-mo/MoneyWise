
/**
 * Servicio para manejar el almacenamiento persistente usando localStorage
 */

const STORAGE_KEYS = {
  TRANSACTIONS: 'finance_transactions',
  BUDGETS: 'finance_budgets',
  GOALS: 'finance_goals',
  DOCUMENTS: 'finance_documents',
  INVESTMENTS: 'finance_investments',
};

/**
 * Guarda datos en localStorage
 */
export const saveData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error al guardar datos para ${key}:`, error);
  }
};

/**
 * Recupera datos de localStorage
 */
export const getData = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error al recuperar datos para ${key}:`, error);
    return defaultValue;
  }
};

export { STORAGE_KEYS };
