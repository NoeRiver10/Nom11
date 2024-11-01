import { ChangeEvent } from 'react';

// Definir tipos para las props de InputField
interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  inputMode?: 'search' | 'email' | 'tel' | 'text' | 'url' | 'none' | 'numeric' | 'decimal';
  pattern?: string;
}

// Tipo de datos del formulario
interface FormData {
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
}

interface AreaFormProps {
  formData: FormData;
  index: number;
  onChange: (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

// Componente reutilizable para inputs de texto
function InputField({ label, ...props }: InputFieldProps) {
  return (
    <div className="mb-4 shadow-inner p-4 rounded-md bg-white">
      <label htmlFor={props.name} className="block text-lg font-semibold mb-2">
        {label}
      </label>
      <input {...props} className="w-full p-3 border border-gray-300 rounded-md" />
    </div>
  );
}

// Definir tipos para las props de SelectField
interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
}

// Componente reutilizable para selects
function SelectField({ label, options, ...props }: SelectFieldProps) {
  return (
    <div className="mb-4 shadow-inner p-4 rounded-md bg-white">
      <label htmlFor={props.name} className="block text-lg font-semibold mb-2">
        {label}
      </label>
      <select {...props} className="w-full p-3 border border-gray-300 rounded-md">
        <option value="">Selecciona una opción</option>
        {options.map((option: string) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function AreaForm({ formData, index, onChange }: AreaFormProps) {
  return (
    <div className="mb-8 p-4 rounded-md border border-gray-300 bg-white">
      {/* Campo para punto de evaluación */}
      <InputField
        name="puntoEvaluacion"
        label="ID Punto de Evaluación"
        type="text"
        value={formData.puntoEvaluacion}
        onChange={(e) => onChange(index, e)}
        disabled
      />

      {/* Campos generales */}
      <InputField
        name="area"
        label="Área"
        type="text"
        value={formData.area}
        onChange={(e) => onChange(index, e)}
        placeholder="Escribe el área aquí"
      />
      <InputField
        name="puesto"
        label="Puesto de Trabajo"
        type="text"
        value={formData.puesto}
        onChange={(e) => onChange(index, e)}
        placeholder="Escribe el puesto de trabajo aquí"
      />
      <InputField
        name="numeroTrabajadoresExpuestos"
        label="Número de Trabajadores Expuestos"
        type="text"
        value={formData.numeroTrabajadoresExpuestos}
        onChange={(e) => onChange(index, e)}
        placeholder="Escribe el número de trabajadores aquí"
      />
      <InputField
        name="descripcionActividades"
        label="Descripción de las Actividades del Puesto por Área de Exposición"
        type="text"
        value={formData.descripcionActividades}
        onChange={(e) => onChange(index, e)}
        placeholder="Describe las actividades aquí"
      />
      <InputField
        name="ubicacion"
        label="Ubicación"
        type="text"
        value={formData.ubicacion}
        onChange={(e) => onChange(index, e)}
        placeholder="Escribe la ubicación aquí"
      />
      <InputField
        name="fuenteEmisora"
        label="Fuente Emisora"
        type="text"
        value={formData.fuenteEmisora}
        onChange={(e) => onChange(index, e)}
        placeholder="Escribe la fuente emisora aquí"
      />

      {/* Selects generales */}
      <SelectField
        name="metodoEvaluacion"
        label="Método de Evaluación"
        value={formData.metodoEvaluacion}
        onChange={(e) => onChange(index, e)}
        options={["GPS", "PAE", "PFT"]}
      />
      <SelectField
        name="labores"
        label="Labores"
        value={formData.labores}
        onChange={(e) => onChange(index, e)}
        options={["De Pie", "Sentado"]}
      />

      {/* Campos para Tiempo de Exposición y EPP Auditivo */}
      <div className="flex space-x-4 mb-4">
        <InputField
          name="tiempoExposicion"
          label="Tiempo de Exposición en Minutos"
          type="text"
          value={formData.tiempoExposicion}
          onChange={(e) => onChange(index, e)}
          placeholder="Escribe el tiempo de exposición"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <SelectField
          name="eppAuditivo"
          label="EPP Auditivo"
          value={formData.eppAuditivo}
          onChange={(e) => onChange(index, e)}
          options={["Sí", "No"]}
        />
      </div>

      {/* Campos para NSA Max y Min */}
      <div className="flex space-x-4 mb-4">
        <InputField
          name="nsaMax"
          label="NSA MAX."
          type="text"
          value={formData.nsaMax}
          onChange={(e) => onChange(index, e)}
          placeholder="Escribe el valor de NSA MAX. aquí"
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <InputField
          name="nsaMin"
          label="NSA MIN."
          type="text"
          value={formData.nsaMin}
          onChange={(e) => onChange(index, e)}
          placeholder="Escribe el valor de NSA MIN. aquí"
          inputMode="numeric"
          pattern="[0-9]*"
        />
      </div>

      {/* Resultado tipo de ruido */}
      <div className="mt-4 shadow-inner p-4 rounded-md bg-white">
        <label className="block text-lg font-semibold mb-2">Tipo de Ruido:</label>
        <p className="p-3 border border-gray-300 rounded-md bg-white">
          {formData.tipoRuido}
        </p>
      </div>

      {/* Selects de evaluación e instrumento */}
      <SelectField
        name="evaluacion"
        label="Evaluación a Realizar"
        value={formData.evaluacion}
        onChange={(e) => onChange(index, e)}
        options={["NER-S", "NPA", "NER-S/NPA"]}
      />
      <SelectField
        name="instrumento"
        label="Instrumentación a Utilizar"
        value={formData.instrumento}
        onChange={(e) => onChange(index, e)}
        options={["SON", "FBO", "MPR", "SON-FBO", "SON-FBO-MPR"]}
      />
    </div>
  );
}
