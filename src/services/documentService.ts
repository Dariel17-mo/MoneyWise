
import { v4 as uuidv4 } from 'uuid';
import { STORAGE_KEYS, getData, saveData } from './storageService';
import { Document } from '@/types/models';

/**
 * Obtiene todos los documentos
 */
export const getAllDocuments = (): Document[] => {
  return getData<Document[]>(STORAGE_KEYS.DOCUMENTS, []);
};

/**
 * Añade un nuevo documento
 */
export const addDocument = (document: Omit<Document, 'id'>): Document => {
  const newDocument = {
    ...document,
    id: uuidv4()
  };
  
  const documents = getAllDocuments();
  documents.unshift(newDocument); // Añadimos al principio para mostrar primero los más recientes
  
  saveData(STORAGE_KEYS.DOCUMENTS, documents);
  
  return newDocument;
};

/**
 * Elimina un documento
 */
export const deleteDocument = (id: string): void => {
  const documents = getAllDocuments();
  const filteredDocuments = documents.filter(d => d.id !== id);
  
  saveData(STORAGE_KEYS.DOCUMENTS, filteredDocuments);
};
