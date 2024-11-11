"use client";

import React, { useState, useEffect } from 'react';

interface MedicionInestableProps {
  tipoRuido: string;
  onChange?: (value: MedicionData) => void;
}

interface MedicionData {
  valores: Record<string, number | string | null>;
}

const MedicionInestable: React.FC<MedicionInestableProps> = ({ tipoRuido, onChange }) => {
  const [periodos, setPeriodos] = useState([
    {
      horaInicio: '',
      horaFin: '',
      valores: Array(10).fill(""), // Inicializa cada valor como una cadena vacía
    },
  ]);

  const [npaPeriodos, setNpaPeriodos] = useState([
    {
      horaInicio: '',
      horaFin: '',
      valores: Array(11).fill(""), // Inicializa cada valor como una cadena vacía
    },
  ]);

  // Helper para sumar minutos a una hora en formato 'HH:mm'
  const addMinutes = (time: string, minutes: number) => {
    const [hours, mins] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes);
    return date.toTimeString().slice(0, 5);
  };

  const addHours = (time: string, hours: number) => {
    const [hour, minute] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hour + hours, minute);
    return date.toTimeString().slice(0, 5);
  };

  useEffect(() => {
    if (onChange) {
      const valores: Record<string, number | string | null> = {};

      periodos.forEach((periodo, index) => {
        valores[`periodo_${index + 1}_horaInicio`] = periodo.horaInicio;
        valores[`periodo_${index + 1}_horaFin`] = periodo.horaFin;
        periodo.valores.forEach((valor, valorIndex) => {
          valores[`periodo_${index + 1}_valor_${valorIndex + 1}`] = valor;
        });
      });

      npaPeriodos.forEach((periodo, index) => {
        valores[`npa_periodo_${index + 1}_horaInicio`] = periodo.horaInicio;
        valores[`npa_periodo_${index + 1}_horaFin`] = periodo.horaFin;
        periodo.valores.forEach((valor, valorIndex) => {
          valores[`npa_periodo_${index + 1}_valor_${valorIndex + 1}`] = valor;
        });
      });

      onChange({ valores });
    }
  }, [periodos, npaPeriodos, onChange]);

  const handleChange = (periodoIndex: number, field: string, value: string) => {
    setPeriodos((prevPeriodos) => {
      const updatedPeriodos = [...prevPeriodos];
      if (field === 'horaInicio') {
        updatedPeriodos[periodoIndex].horaInicio = value;
        updatedPeriodos[periodoIndex].horaFin = addMinutes(value, 5); // Ajuste de 5 minutos para horaFinal
      } else if (field === 'horaFin') {
        updatedPeriodos[periodoIndex].horaFin = value;
      } else {
        updatedPeriodos[periodoIndex].valores[parseInt(field)] = value;
      }
      return updatedPeriodos;
    });
  };

  const handleNpaChange = (periodoIndex: number, field: string, value: string) => {
    setNpaPeriodos((prevPeriodos) => {
      const updatedPeriodos = [...prevPeriodos];
      if (field === 'horaInicio') {
        updatedPeriodos[periodoIndex].horaInicio = value;
        updatedPeriodos[periodoIndex].horaFin = addMinutes(value, 1); // Ajuste de 1 minuto para horaFinal
      } else {
        updatedPeriodos[periodoIndex].valores[parseInt(field)] = value;
      }
      return updatedPeriodos;
    });
  };

  const agregarPeriodo = () => {
    if (periodos.length < 3) {
      setPeriodos((prevPeriodos) => {
        const lastPeriodo = prevPeriodos[prevPeriodos.length - 1];
        const newHoraInicio = addHours(lastPeriodo.horaInicio, 2); // Ajuste de 2 horas después de la horaInicio del último periodo
        const newHoraFin = addMinutes(newHoraInicio, 5); // Ajuste de 5 minutos después de la nueva horaInicio

        return [
          ...prevPeriodos,
          {
            horaInicio: newHoraInicio,
            horaFin: newHoraFin,
            valores: Array(10).fill(""), // Inicializa con valores vacíos para que el usuario pueda llenarlos libremente
          },
        ];
      });
    }
  };

  const agregarNpaPeriodo = () => {
    if (npaPeriodos.length < 2) {
      setNpaPeriodos((prevPeriodos) => {
        const lastPeriodo = prevPeriodos[prevPeriodos.length - 1];
        const newHoraInicio = addHours(lastPeriodo.horaInicio, 2); // Ajuste de 2 horas después de la horaInicio del último periodo
        const newHoraFin = addMinutes(newHoraInicio, 1); // Ajuste de 1 minuto después de la nueva horaInicio

        return [
          ...prevPeriodos,
          {
            horaInicio: newHoraInicio,
            horaFin: newHoraFin,
            valores: Array(11).fill(""), // Inicializa con valores vacíos para que el usuario pueda llenarlos libremente
          },
        ];
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Medición Inestable - {tipoRuido}</h2>
      {periodos.map((periodo, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-100 shadow-sm">
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
                readOnly // Deshabilitamos entrada directa para horaFin, ya que se autocalcula
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-10 gap-2">
            {periodo.valores.map((valor, valorIndex) => (
              <div key={valorIndex}>
                <label className="block text-xs font-bold mb-1" htmlFor={`valor-${index}-${valorIndex}`}>{index * 10 + valorIndex + 1}</label>
                <input
                  type="number"
                  step="0.01"
                  id={`valor-${index}-${valorIndex}`}
                  value={valor}
                  onChange={(e) => handleChange(index, valorIndex.toString(), e.target.value)}
                  className="w-full p-1 border rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={agregarPeriodo}
        disabled={periodos.length >= 3}
        className={`mt-4 p-2 ${periodos.length >= 3 ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md font-semibold`}
      >
        Agregar Período
      </button>

      <hr className="my-8" /> {/* Línea de separación entre las tablas */}

      {/* Título adicional debajo de la línea */}
      <h2 className="text-xl font-bold mb-4 text-purple-700 text-center">Medición Inestable - NPA - Período de Observación</h2>

      {/* Tabla NPA */}
      {npaPeriodos.map((periodo, index) => (
        <div key={index} className="mt-8 p-4 border rounded-lg bg-gray-100 shadow-sm">
          <h3 className="text-lg font-bold mb-2 text-purple-600">Período de Observación {index + 1}</h3>
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
                readOnly // Deshabilitamos entrada directa para horaFin, ya que se autocalcula
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>
          <div className="grid grid-cols-11 gap-2">
            {periodo.valores.map((valor, valorIndex) => (
              <div key={valorIndex}>
                <label className="block text-xs font-bold mb-1" htmlFor={`npaValor-${index}-${valorIndex}`}>{['dB(A)', 'dB linea I', '31.5', '63', '125', '250', '500', '1000', '2000', '4000', '8000'][valorIndex]}</label>
                <input
                  type="number"
                  step="0.01"
                  id={`npaValor-${index}-${valorIndex}`}
                  value={valor}
                  onChange={(e) => handleNpaChange(index, valorIndex.toString(), e.target.value)}
                  className="w-full p-1 border rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={agregarNpaPeriodo}
        disabled={npaPeriodos.length >= 2}
        className={`mt-4 p-2 ${npaPeriodos.length >= 2 ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'} text-white rounded-md font-semibold`}
      >
        Agregar Período NPA
      </button>
    </div>
  );
};

export default MedicionInestable;
