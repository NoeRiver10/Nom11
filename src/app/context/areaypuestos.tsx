"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definimos la interfaz `AreaData` incluyendo el campo de altura.
export interface AreaData {
  puntoEvaluacion: string;
  area: string;
  puesto: string;
  numeroTrabajadoresExpuestos: string;
  descripcionActividades: string;
  ubicacion: string;
  fuenteEmisora: string;
  metodoEvaluacion: string;
  labores: string;
  tiempoExposicion: string;
  eppAuditivo: string;
  nsaMax: string;
  nsaMin: string;
  tipoRuido: string;
  evaluacion: string;
  instrumento: string;
  altura?: string; // Campo opcional de altura
}

// Definimos el tipo del contexto `AreasYpuestosContextType`
interface AreasYpuestosContextType {
  areas: AreaData[];
  setAreas: React.Dispatch<React.SetStateAction<AreaData[]>>;
}

// Creamos el contexto y le damos un valor inicial `undefined`
const AreasYpuestosContext = createContext<AreasYpuestosContextType | undefined>(undefined);

// Proveedor del contexto `AreasYpuestosProvider`
export const AreasYpuestosProvider = ({ children }: { children: ReactNode }) => {
  const [areas, setAreas] = useState<AreaData[]>([]);

  return (
    <AreasYpuestosContext.Provider value={{ areas, setAreas }}>
      {children}
    </AreasYpuestosContext.Provider>
  );
};

// Hook personalizado para usar el contexto `useAreasYpuestos`
export const useAreasYpuestos = () => {
  const context = useContext(AreasYpuestosContext);
  if (!context) {
    throw new Error('useAreasYpuestos debe usarse dentro de un AreasYpuestosProvider');
  }
  return context;
};
