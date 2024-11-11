// nom11/src/app/reconocimientoOnce.tsx

"use client";

import { useState, useEffect, ChangeEvent, useCallback } from 'react';
import ResumenAreas11 from './components/componentesReconocimiento/resumenAreao';
import AreaForm from './components/componentesReconocimiento/areaForm';
import { useAreasYpuestos, AreaData } from './context/areaypuestos'; // Importar `AreaData` desde el contexto
import { useRouter } from 'next/navigation'; // Importar useRouter de next/navigation
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'; // Importar íconos de flecha

export default function ReconocimientoOnce() {
  const router = useRouter(); // Inicializar useRouter para la navegación
  const [forms, setForms] = useState<AreaData[]>([]);
  const [currentFormIndex, setCurrentFormIndex] = useState(0);
  const [showResumen, setShowResumen] = useState(false);
  const [puntoEvaluacionCounter, setPuntoEvaluacionCounter] = useState(1);

  // Acceso al contexto
  const { areas, setAreas } = useAreasYpuestos();

  const createEmptyFormData = useCallback((puntoEvaluacion: number): AreaData => {
    return {
      puntoEvaluacion: puntoEvaluacion.toString(),
      area: "",
      puesto: "",
      numeroTrabajadoresExpuestos: "",
      descripcionActividades: "",
      ubicacion: "",
      fuenteEmisora: "",
      metodoEvaluacion: "",
      labores: "",
      tiempoExposicion: "",
      eppAuditivo: "",
      nsaMax: "",
      nsaMin: "",
      tipoRuido: "",
      evaluacion: "",
      instrumento: "",
      altura: "", // Asegúrate de que siempre haya un valor (puede ser cadena vacía)
      numTrabajadoresExpuestos: "", // Agrega un valor predeterminado para evitar que sea `undefined`
      epp: "", // Agrega un valor predeterminado para evitar que sea `undefined`
    };
  }, []);

  useEffect(() => {
    if (forms.length === 0) {
      setForms([createEmptyFormData(puntoEvaluacionCounter)]);
    }
  }, [createEmptyFormData, forms.length, puntoEvaluacionCounter]);

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForms((prevForms) => {
      const updatedForms = [...prevForms];
      updatedForms[index] = {
        ...updatedForms[index],
        [name]: value,
      };

      // Calcular el tipo de ruido si se cambia nsaMax o nsaMin
      if (name === "nsaMax" || name === "nsaMin") {
        const nsaMaxNumber = parseFloat(updatedForms[index].nsaMax);
        const nsaMinNumber = parseFloat(updatedForms[index].nsaMin);
        if (!isNaN(nsaMaxNumber) && !isNaN(nsaMinNumber) && (nsaMaxNumber - nsaMinNumber >= 5)) {
          updatedForms[index].tipoRuido = "R-IN";
        } else {
          updatedForms[index].tipoRuido = "R-ES";
        }
      }

      return updatedForms;
    });
  };

  const handleAddPuesto = () => {
    setPuntoEvaluacionCounter((prevCounter) => prevCounter + 1);

    setForms((prevForms) => {
      const newForm = {
        ...prevForms[currentFormIndex],
        puntoEvaluacion: (puntoEvaluacionCounter + 1).toString(),
        puesto: '',
        numeroTrabajadoresExpuestos: '',
        descripcionActividades: '',
        ubicacion: '',
        fuenteEmisora: '',
        metodoEvaluacion: '',
        labores: '',
        tiempoExposicion: '',
        eppAuditivo: '',
        nsaMax: '',
        nsaMin: '',
        tipoRuido: '',
        evaluacion: '',
        instrumento: '',
        altura: "",
        numTrabajadoresExpuestos: "",
        epp: "",
      };
      return [...prevForms, newForm];
    });

    setCurrentFormIndex((prevIndex) => prevIndex + 1);
    console.log("Puesto agregado, nuevo índice de formulario actual:", currentFormIndex + 1);
  };

  const handleAddArea = () => {
    const currentArea = forms[currentFormIndex];
    const isDuplicate = areas.some(
      (area) => area.puntoEvaluacion === currentArea.puntoEvaluacion
    );

    if (!isDuplicate && currentArea.area !== "") {
      setAreas((prevAreas) => [...prevAreas, currentArea]);
      console.log("Área agregada:", currentArea);
    }

    setPuntoEvaluacionCounter((prevCounter) => prevCounter + 1);
    const newForm = createEmptyFormData(puntoEvaluacionCounter + 1);
    setForms((prevForms) => [...prevForms, newForm]);
    setCurrentFormIndex(forms.length);
    console.log("Área agregada, nuevo formulario creado con punto de evaluación:", puntoEvaluacionCounter + 1);
  };

  const handleSaveArea = () => {
    const currentArea = forms[currentFormIndex];
    const isDuplicate = areas.some(area => area.puntoEvaluacion === currentArea.puntoEvaluacion);
  
    if (!isDuplicate && currentArea.area !== "") {
      // Actualizar el contexto
      setAreas((prevAreas) => [...prevAreas, currentArea]);
      console.log("Área guardada:", currentArea);
      alert("Área guardada exitosamente");
    } else if (isDuplicate) {
      alert("El área ya ha sido guardada previamente");
    } else {
      alert("El área no puede estar vacía");
    }
  };

  const handleDeleteArea = (index: number) => {
    setAreas((prevAreas) => prevAreas.filter((_, i) => i !== index));
    console.log("Área eliminada en el índice:", index);
  };

  const handleEditArea = (index: number) => {
    const areaToEdit = areas[index];
    const fullAreaToEdit: AreaData = {
      ...createEmptyFormData(parseInt(areaToEdit.puntoEvaluacion)),
      ...areaToEdit,
    };
    setForms([fullAreaToEdit]);
    setCurrentFormIndex(0);
    setShowResumen(false);
    console.log("Editando área en el índice:", index);
  };

  const handleNextForm = () => {
    if (currentFormIndex < forms.length - 1) {
      setCurrentFormIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        console.log("Navegando al siguiente formulario, nuevo índice:", newIndex);
        return newIndex;
      });
    }
  };

  const handlePreviousForm = () => {
    if (currentFormIndex > 0) {
      setCurrentFormIndex((prevIndex) => {
        const newIndex = prevIndex - 1;
        console.log("Navegando al formulario anterior, nuevo índice:", newIndex);
        return newIndex;
      });
    }
  };

  if (showResumen) {
    return (
      <ResumenAreas11
        areas={areas.map((area) => ({
          ...createEmptyFormData(parseInt(area.puntoEvaluacion)),
          ...area,
        }))}
        onBack={() => setShowResumen(false)}
        onEdit={handleEditArea}
        onDelete={handleDeleteArea}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 p-8">
      <h1 className="text-4xl font-bold mb-8 text-blue-600 text-center">
        Reconocimiento Sensorial
      </h1>
      {forms.length > 0 && forms[currentFormIndex] && (
        <AreaForm
          formData={forms[currentFormIndex]}
          index={currentFormIndex}
          onChange={handleChange}
        />
      )}
      <div className="flex flex-wrap gap-2 mt-6">
        <button
          onClick={handlePreviousForm}
          className="p-2 text-sm bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700"
          disabled={currentFormIndex === 0}
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={handleNextForm}
          className="p-2 text-sm bg-gray-600 text-white rounded-md font-semibold hover:bg-gray-700"
          disabled={currentFormIndex === forms.length - 1}
        >
          <FaArrowRight />
        </button>
        <button
          onClick={handleAddPuesto}
          className="p-2 text-sm bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700"
        >
          Agregar Puesto
        </button>
        <button
          onClick={handleAddArea}
          className="p-2 text-sm bg-green-600 text-white rounded-md font-semibold hover:bg-green-700"
        >
          Agregar Área
        </button>
        <button
          onClick={handleSaveArea}
          className="p-2 text-sm bg-yellow-600 text-white rounded-md font-semibold hover:bg-yellow-700"
        >
          Guardar
        </button>
        <button
          onClick={() => router.push('/Mediciones11')}
          className="p-2 text-sm bg-red-600 text-white rounded-md font-semibold hover:bg-red-700"
        >
          Ir a Mediciones
        </button>
        <button
          onClick={() => setShowResumen(true)}
          className="p-2 text-sm bg-purple-600 text-white rounded-md font-semibold hover:bg-purple-700"
        >
          Resumen
        </button>
      </div>
    </div>
  );
}
