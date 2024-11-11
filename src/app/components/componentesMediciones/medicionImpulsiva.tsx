"use client";

import React, { useState } from 'react';

interface MedicionImpulsivaProps {
  tipoRuido: string;
  onChange?: (valores: Record<string, number | string | null>) => void;
}

const MedicionImpulsiva: React.FC<MedicionImpulsivaProps> = ({ tipoRuido, onChange }) => {
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [valores, setValores] = useState<(number | string | null)[]>(Array(45).fill('')); // Inicializamos 45 mediciones vacías

  // Helper para sumar minutos a una hora en formato 'HH:mm'
  const addMinutes = (time: string, minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);
    return date.toTimeString().slice(0, 5);
  };

  const handleHoraInicioChange = (value: string) => {
    setHoraInicio(value);
    const nuevaHoraFin = addMinutes(value, 15); // La hora final es 15 minutos después de la hora inicial
    setHoraFin(nuevaHoraFin);
    handleBlur(); // Notificar cambios al cambiar la hora de inicio
  };

  const handleValorChange = (index: number, value: string) => {
    setValores((prevValores) => {
      const updatedValores = [...prevValores];
      updatedValores[index] = value;
      return updatedValores;
    });
  };

  const handleBlur = () => {
    if (onChange) {
      const valoresData: Record<string, number | string | null> = {
        horaInicio,
        horaFin,
      };
      valores.forEach((valor, index) => {
        valoresData[`valor_${index + 1}`] = valor;
      });
      onChange(valoresData);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Mediciones Impulsivas - Tipo de Ruido: {tipoRuido}</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-1" htmlFor="horaInicio">Hora Inicial</label>
          <input
            type="time"
            id="horaInicio"
            value={horaInicio}
            onChange={(e) => handleHoraInicioChange(e.target.value)}
            onBlur={handleBlur}
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-bold mb-1" htmlFor="horaFin">Hora Final</label>
          <input
            type="time"
            id="horaFin"
            value={horaFin}
            readOnly
            className="w-full p-2 border rounded-md bg-gray-100"
          />
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {valores.map((valor, index) => (
          <div key={index} className="p-2 border rounded-lg bg-gray-50">
            <label className="block text-xs font-bold mb-1" htmlFor={`valor-${index}`}>{index + 1}</label>
            <input
              type="number"
              step="0.01"
              id={`valor-${index}`}
              value={valor ?? ''}
              onChange={(e) => handleValorChange(index, e.target.value)}
              onBlur={handleBlur}
              className="w-full p-1 border rounded-md"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicionImpulsiva;
