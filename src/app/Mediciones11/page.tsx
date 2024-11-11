"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAreasYpuestos, AreaData } from '../context/areaypuestos';
import MedicionGenerica from '../components/componentesMediciones/medicionGenerica';
import MedicionImpulsiva from '../components/componentesMediciones/medicionImpulsiva';
import ResumenMediciones from '../components/componentesMediciones/resumenMediciones';

interface MedicionData {
  id: string;
  area: string;
  puesto: string;
  altura: string;
  tipoRuido: string;
  valores: Record<string, number | string | null>;
}

interface Mediciones11Props {
  id: string; // ID recibido del reconocimiento sensorial
}

export default function Mediciones11({ id }: Mediciones11Props) {
  const router = useRouter();
  const { areas } = useAreasYpuestos();
  const [selectedArea, setSelectedArea] = useState('');
  const [filteredPuestos, setFilteredPuestos] = useState<AreaData[]>([]);
  const [altura, setAltura] = useState('');
  const [tipoRuido, setTipoRuido] = useState(() => areas[0]?.tipoRuido || '');
  const [tempMedicionData, setTempMedicionData] = useState<MedicionData>({
    id: id, // Usar el ID recibido
    area: '',
    puesto: '',
    altura: '',
    tipoRuido: '',
    valores: {},
  });
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [todasLasMediciones, setTodasLasMediciones] = useState<MedicionData[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'area') {
      setSelectedArea(value);
    } else if (name === 'altura') {
      setAltura(value);
    } else if (name === 'tipoRuido') {
      setTipoRuido(value);
    }
  };

  const handleGuardarMediciones = useCallback(() => {
    if (!selectedArea || !altura || !tipoRuido || !tempMedicionData) {
      alert('Por favor, complete todos los campos antes de guardar.');
      return;
    }

    const medicionDatosCompletos: MedicionData = {
      ...tempMedicionData,
      area: selectedArea,
      puesto: filteredPuestos.length > 0 ? filteredPuestos[0].puesto : '',
      altura,
      tipoRuido,
    };

    setTodasLasMediciones((prevMediciones) => [...prevMediciones, medicionDatosCompletos]);

    console.log('Datos de Mediciones Guardados:', JSON.stringify(medicionDatosCompletos, null, 2));
  }, [selectedArea, filteredPuestos, altura, tipoRuido, tempMedicionData]);

  useEffect(() => {
    if (selectedArea) {
      const filtered = areas.filter((area: AreaData) => area.area === selectedArea);
      setFilteredPuestos(filtered);
      if (filtered.length > 0 && filtered[0].tipoRuido) {
        setTipoRuido(filtered[0].tipoRuido);
      } else {
        setTipoRuido('');
      }
    } else {
      setFilteredPuestos([]);
      setTipoRuido('');
    }
  }, [selectedArea, areas]);

  const handleMedicionChange = useCallback((valores: Record<string, number | string | null>) => {
    setTempMedicionData((prev) => ({
      ...prev,
      valores: {
        ...prev.valores,
        ...valores,
      },
    }));
  }, []);

  const handleAgregarPunto = () => {
    if (!selectedArea || !altura || !tipoRuido || !tempMedicionData) {
      alert('Por favor, complete todos los campos antes de agregar un punto.');
      return;
    }

    const nuevoPunto: MedicionData = {
      ...tempMedicionData,
      id: `${selectedArea}-${Date.now()}`, // Generar un nuevo ID para el punto agregado
      area: selectedArea,
      puesto: filteredPuestos.length > 0 ? filteredPuestos[0].puesto : '',
      altura,
      tipoRuido,
    };

    setTodasLasMediciones((prevMediciones) => [...prevMediciones, nuevoPunto]);

    // Limpiar los valores para una nueva entrada
    setTempMedicionData({
      id: '',
      area: '',
      puesto: '',
      altura: '',
      tipoRuido: '',
      valores: {},
    });

    console.log('Nuevo Punto Agregado:', JSON.stringify(nuevoPunto, null, 2));
  };

  const handleIrAResumen = () => {
    if (todasLasMediciones.length > 0) {
      setMostrarResumen(true);
    }
  };

  const handleVolver = () => {
    setMostrarResumen(false);
  };

  if (mostrarResumen) {
    return (
      <ResumenMediciones
        todasLasMediciones={todasLasMediciones}
        onBack={handleVolver}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">Mediciones</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">

        {/* Mostrar ID de Medición Actual */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-700">
            ID de Medición Actual: {tempMedicionData.id}
          </h2>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="area">
            Seleccionar Área
          </label>
          <select
            id="area"
            name="area"
            value={selectedArea}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Seleccione un área</option>
            {[...new Set(areas.map((area: AreaData) => area.area))]
              .filter((area): area is string => typeof area === 'string')
              .map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="puesto">
            Seleccionar Puesto de Trabajo
          </label>
          <select
            id="puesto"
            name="puesto"
            className="w-full p-2 border rounded-md"
          >
            <option value="">Seleccione un puesto</option>
            {filteredPuestos.map((puesto: AreaData) => (
              <option key={puesto.puesto} value={puesto.puesto}>
                {puesto.puesto}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="altura">
            Altura (en metros)
          </label>
          <input
            type="number"
            id="altura"
            name="altura"
            value={altura}
            onChange={(e) => handleChange(e)}
            min="0"
            step="0.01"
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2" htmlFor="tipoRuido">
            Lectura
          </label>
          <select
            id="tipoRuido"
            name="tipoRuido"
            value={tipoRuido}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 border rounded-md"
          >
            <option value="">Seleccione el tipo de ruido</option>
            <option value="R-ES">R-ES</option>
            <option value="R-IN">R-IN</option>
            <option value="R-IM">R-IM</option>
          </select>
        </div>

        {/* Renderizar el componente adecuado basado en el tipo de ruido */}
        {tipoRuido && tipoRuido !== "R-IM" && (
          <MedicionGenerica
            tipoRuido={tipoRuido}
            maxPeriodos={tipoRuido === "R-ES" ? 2 : 3}
            maxPeriodosNPA={tipoRuido === "R-ES" ? 1 : 2}
            intervaloFinMinutos={5}
            intervaloInicioSiguientePeriodo={2}
            onChange={handleMedicionChange}
            mostrarSubtitulosValores={true}
          />
        )}
        {tipoRuido === "R-IM" && (
          <MedicionImpulsiva tipoRuido={tipoRuido} onChange={handleMedicionChange} />
        )}

        <button
          onClick={handleGuardarMediciones}
          className="mb-4 p-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
        >
          Guardar Mediciones
        </button>

        <button
          onClick={handleAgregarPunto}
          className="mb-4 ml-4 p-3 bg-yellow-600 text-white rounded-md font-semibold hover:bg-yellow-700"
        >
          Agregar Punto
        </button>

        <button
          onClick={handleIrAResumen}
          className="mb-4 p-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
        >
          Ir a Resumen
        </button>

        <button
          onClick={() => router.push('/')}
          className="mb-4 p-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700"
        >
          Regresar a Reconocimiento
        </button>
      </div>
    </div>
  );
}
