"use client";

import React from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Iconos para acciones

interface ResumenAreasProps {
  areas: {
    puntoEvaluacion: string;
    area: string;
    puesto: string;
    ubicacion: string;
    fuenteEmisora: string;
    metodoEvaluacion: string;
    labores: string;
    nsaMax: string;
    nsaMin: string;
    tipoRuido: string;
    evaluacion: string;
    instrumento: string;
  }[];
}

const ResumenAreas11: React.FC<ResumenAreasProps & { onBack: () => void, onEdit: (index: number) => void, onDelete: (index: number) => void }> = ({ areas, onBack, onEdit, onDelete }) => {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-green-600 text-center">
        Resumen de Puntos de Evaluación
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {areas.map((area, index) => (
          <div
            key={index}
            className="relative bg-gradient-to-r from-green-100 to-green-200 rounded-lg shadow-lg p-6 border-l-4 border-green-500"
          >
            <h2 className="text-2xl font-bold text-green-700 mb-4">
              ID Punto de Evaluación {area.puntoEvaluacion}
            </h2>
            {/* Botones de acción para editar y eliminar */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => onEdit(index)}
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
              >
                <FaEdit />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <FaTrashAlt />
              </button>
            </div>
            {/* Detalles del Punto de Evaluación */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Detalles del Punto de Evaluación:</h3>
              <p>Punto de Evaluación: {area.area}</p>
              <p>Puesto: {area.puesto}</p>
              <p>Ubicación: {area.ubicacion}</p>
              <p>Fuente Emisora: {area.fuenteEmisora}</p>
              <p>Método de Evaluación: {area.metodoEvaluacion}</p>
              <p>Labores: {area.labores}</p>
            </div>

            {/* Valores de NSA */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Valores de NSA:</h3>
              <p>NSA Máx: {area.nsaMax}</p>
              <p>NSA Mín: {area.nsaMin}</p>
              <p>Tipo de Ruido: {area.tipoRuido}</p>
            </div>

            {/* Evaluación e Instrumentación */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Evaluación e Instrumentación:</h3>
              <p>Evaluación: {area.evaluacion}</p>
              <p>Instrumento: {area.instrumento}</p>
            </div>
          </div>
        ))}
      </div>
      <button onClick={onBack} className="mt-8 p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700">
        Volver a los Puntos de Evaluación
      </button>
    </div>
  );
};

export default ResumenAreas11;
