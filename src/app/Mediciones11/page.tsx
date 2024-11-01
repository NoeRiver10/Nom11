// Página de Mediciones11 para el componente de mediciones

"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAreasYpuestos, AreaData } from '../context/areaypuestos';

// Importa el hook personalizado para el contexto

export default function Mediciones11() {
  const router = useRouter();
  const { areas } = useAreasYpuestos(); // Obtén los datos del contexto
  const [selectedArea, setSelectedArea] = useState('');
  const [filteredPuestos, setFilteredPuestos] = useState<AreaData[]>([]);
  const [altura, setAltura] = useState('');
  const [tipoRuido, setTipoRuido] = useState('');

  useEffect(() => {
    if (selectedArea) {
      const filtered = areas.filter((area: AreaData) => area.area === selectedArea);
      setFilteredPuestos(filtered);
      if (filtered.length > 0 && filtered[0].tipoRuido) {
        setTipoRuido(filtered[0].tipoRuido);
      } else {
        setTipoRuido('R-IM');
      }
    } else {
      setFilteredPuestos([]);
      setTipoRuido('R-IM');
    }
  }, [selectedArea, areas]);

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

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">Mediciones</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mb-4">
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
            Tipo de Ruido
          </label>
          <select
            id="tipoRuido"
            name="tipoRuido"
            value={tipoRuido}
            onChange={(e) => handleChange(e)}
            className="w-full p-2 border rounded-md"
          >
            <option value={filteredPuestos[0]?.tipoRuido || 'R-IM'}>{filteredPuestos[0]?.tipoRuido || 'R-IM'}</option>
            <option value="R-IM">R-IM</option>
          </select>
        </div>

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
