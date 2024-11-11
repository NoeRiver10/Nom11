import React from 'react';

interface ResumenMedicionesProps {
  todasLasMediciones: {
    id: string;
    area: string;
    puesto: string;
    altura: string;
    tipoRuido: string;
    valores: Record<string, number | string | null>;
  }[];
  onBack: () => void;
}

const ResumenMediciones: React.FC<ResumenMedicionesProps> = ({ todasLasMediciones, onBack }) => {
  return (
    <div>
      <h2>Resumen de Mediciones</h2>
      {todasLasMediciones.map((medicion) => (
        <div key={medicion.id} className="medicion-resumen">
          <h3>Medición ID: {medicion.id}</h3>
          <p>Área: {medicion.area}</p>
          <p>Puesto: {medicion.puesto}</p>
          <p>Altura: {medicion.altura} metros</p>
          <p>Tipo de Ruido: {medicion.tipoRuido}</p>
          <p>Valores: {JSON.stringify(medicion.valores, null, 2)}</p>
        </div>
      ))}
      <button onClick={onBack} className="p-3 bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700">
        Volver
      </button>
    </div>
  );
};

export default ResumenMediciones;
