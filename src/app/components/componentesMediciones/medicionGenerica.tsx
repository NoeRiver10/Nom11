"use client";

import React, { useState, useEffect } from 'react';

interface MedicionGenericaProps {
  tipoRuido: string; // "R-ES" o "R-IN"
  maxPeriodos: number; // Cantidad máxima de períodos de medición (2 o 3)
  maxPeriodosNPA: number; // Cantidad máxima de períodos NPA (1 o 2)
  intervaloFinMinutos: number; // Intervalo en minutos para la hora final del período (5 minutos)
  intervaloInicioSiguientePeriodo: number; // Intervalo en horas para el inicio del siguiente período (2 horas)
  onChange?: (valores: Record<string, number | string | null>) => void;
  mostrarSubtitulosValores?: boolean;
  etiquetasValoresNPA?: string[];
}

interface Periodo {
  horaInicio: string;
  horaFin: string;
  valores: (number | string | null)[];
}

const MedicionGenerica: React.FC<MedicionGenericaProps> = ({
  tipoRuido,
  maxPeriodos,
  maxPeriodosNPA,
  intervaloFinMinutos,
  intervaloInicioSiguientePeriodo,
  onChange,
  mostrarSubtitulosValores = false,
  etiquetasValoresNPA = [],
}) => {
  const [periodos, setPeriodos] = useState<Periodo[]>(
    Array.from({ length: maxPeriodos }, () => ({
      horaInicio: '',
      horaFin: '',
      valores: Array(10).fill(null),
    }))
  );

  const [npaPeriodos, setNpaPeriodos] = useState<Periodo[]>(
    Array.from({ length: maxPeriodosNPA }, () => ({
      horaInicio: '',
      horaFin: '',
      valores: Array(11).fill(null),
    }))
  );

  // Helper para sumar minutos a una hora en formato 'HH:mm'
  const addMinutes = (time: string, minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);
    return date.toTimeString().slice(0, 5);
  };

  // Helper para sumar horas a una hora en formato 'HH:mm'
  const addHours = (time: string, hours: number) => {
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour + hours, minute);
    return date.toTimeString().slice(0, 5);
  };

  useEffect(() => {
    if (onChange) {
      const valores: Record<string, number | string | null> = {};

      periodos.forEach((periodo, periodoIndex) => {
        valores[`periodo_${periodoIndex + 1}_horaInicio`] = periodo.horaInicio;
        valores[`periodo_${periodoIndex + 1}_horaFin`] = periodo.horaFin;
        periodo.valores.forEach((valor, valorIndex) => {
          valores[`periodo_${periodoIndex + 1}_valor_${valorIndex + 1}`] = valor;
        });
      });

      npaPeriodos.forEach((periodo, periodoIndex) => {
        valores[`npa_periodo_${periodoIndex + 1}_horaInicio`] = periodo.horaInicio;
        valores[`npa_periodo_${periodoIndex + 1}_horaFin`] = periodo.horaFin;
        periodo.valores.forEach((valor, valorIndex) => {
          valores[`npa_valor_${periodoIndex + 1}_${valorIndex + 1}`] = valor;
        });
      });

      onChange(valores);
    }
  }, [periodos, npaPeriodos, onChange]);

  const handleChange = (periodoIndex: number, field: 'horaInicio' | 'horaFin' | `valores.${number}`, value: string) => {
    setPeriodos((prevPeriodos) => {
      const periodos = [...prevPeriodos];
      if (field === 'horaInicio') {
        periodos[periodoIndex].horaInicio = value;
        periodos[periodoIndex].horaFin = addMinutes(value, intervaloFinMinutos);

        if (periodoIndex < maxPeriodos - 1) {
          periodos[periodoIndex + 1].horaInicio = addHours(value, intervaloInicioSiguientePeriodo);
          periodos[periodoIndex + 1].horaFin = addMinutes(periodos[periodoIndex + 1].horaInicio, intervaloFinMinutos);
        }
      } else if (field === 'horaFin') {
        periodos[periodoIndex].horaFin = value;
      } else if (field.startsWith('valores.')) {
        const valorIndex = parseInt(field.split('.')[1], 10);
        periodos[periodoIndex].valores[valorIndex] = value;
      }
      return periodos;
    });
  };

  const handleNpaChange = (periodoIndex: number, field: 'horaInicio' | 'horaFin' | `valores.${number}`, value: string) => {
    setNpaPeriodos((prevNpaPeriodos) => {
      const npaPeriodos = [...prevNpaPeriodos];
      if (field === 'horaInicio') {
        npaPeriodos[periodoIndex].horaInicio = value;
        npaPeriodos[periodoIndex].horaFin = addMinutes(value, 1);
      } else if (field === 'horaFin') {
        npaPeriodos[periodoIndex].horaFin = value;
      } else if (field.startsWith('valores.')) {
        const valorIndex = parseInt(field.split('.')[1], 10);
        npaPeriodos[periodoIndex].valores[valorIndex] = value;
      }
      return npaPeriodos;
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Medición - {tipoRuido}</h2>
      
      {/* Períodos de Medición */}
      {periodos.map((periodo, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-bold mb-2">Período {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold mb-1" htmlFor={`horaInicio-${index}`}>Hora Inicial</label>
              <input
                type="time"
                id={`horaInicio-${index}`}
                value={periodo.horaInicio}
                onChange={(e) => handleChange(index, 'horaInicio', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" htmlFor={`horaFin-${index}`}>Hora Final</label>
              <input
                type="time"
                id={`horaFin-${index}`}
                value={periodo.horaFin}
                readOnly
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {mostrarSubtitulosValores && (
              <div className="col-span-10 grid grid-cols-10 gap-2 text-center text-xs font-bold text-gray-700 mb-2">
                {periodo.valores.map((_, i) => (<div key={i}>{index * 10 + i + 1}</div>))}
              </div>
            )}
            {periodo.valores.map((valor, valorIndex) => (
              <input
                key={valorIndex}
                type="text"
                value={valor ?? ''}
                onChange={(e) => handleChange(index, `valores.${valorIndex}`, e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            ))}
          </div>
        </div>
      ))}

      {/* Períodos NPA */}
      {npaPeriodos.map((periodo, index) => (
        <div key={index} className="mt-8 p-4 border rounded-lg bg-gray-100">
          <h3 className="text-lg font-bold mb-2 text-purple-600">Período NPA {index + 1}</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-bold mb-1" htmlFor={`npaHoraInicio-${index}`}>Hora Inicial</label>
              <input
                type="time"
                id={`npaHoraInicio-${index}`}
                value={periodo.horaInicio}
                onChange={(e) => handleNpaChange(index, 'horaInicio', e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1" htmlFor={`npaHoraFin-${index}`}>Hora Final</label>
              <input
                type="time"
                id={`npaHoraFin-${index}`}
                value={periodo.horaFin}
                readOnly
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-11 gap-2">
            {etiquetasValoresNPA.length > 0 && (
              <div className="col-span-11 grid grid-cols-11 gap-2 text-center text-xs font-bold text-gray-700 mb-2">
                {periodo.valores.map((_, i) => (<div key={i}>{i + 1}</div>))}
              </div>
            )}
            {periodo.valores.map((valor, valorIndex) => (
              <input
                key={valorIndex}
                type="text"
                value={valor ?? ''}
                onChange={(e) => handleNpaChange(index, `valores.${valorIndex}`, e.target.value)}
                className="w-full p-2 border rounded-md"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicionGenerica;
