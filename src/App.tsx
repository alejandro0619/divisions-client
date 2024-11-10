import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Definimos el tipo de cada operación de división
type Operacion = {
  numerador: number;
  denominador: number;
};

// Función para generar operaciones de división
const generarOperaciones = (cantidad: number): Operacion[] => {
  const operaciones: Operacion[] = [];
  while (operaciones.length < cantidad) {
    const numerador = Math.floor(Math.random() * 90) + 10; // Genera número entre 10 y 99
    const denominador = Math.floor(Math.random() * 9) + 1; // Genera número entre 1 y 9 (evita 0)
    
    // Asegura que la división es exacta
    if (numerador % denominador === 0) {
      operaciones.push({ numerador, denominador });
    }
  }
  return operaciones;
};

const DivisionApp: React.FC = () => {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [seleccionada, setSeleccionada] = useState<Operacion | null>(null);

  // Generar operaciones al cargar la página
  useEffect(() => {
    setOperaciones(generarOperaciones(12)); // Genera 12 operaciones
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4"> {/* Grid de 3 columnas */}
        {operaciones.map((operacion, index) => (
          <button
            key={index}
            onClick={() => setSeleccionada(operacion)}
            className={`p-4 border rounded ${
              seleccionada ? 'blur' : ''
            } flex flex-col items-center`}
          >
            <span className="text-2xl font-bold">{operacion.numerador}</span>
            <span className="text-xl">——</span> {/* Línea de fracción */}
            <span className="text-2xl font-bold">{operacion.denominador}</span>
          </button>
        ))}
      </div>

      {/* Ventana emergente de operación seleccionada */}
      <AnimatePresence>
        {seleccionada && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm"
            onClick={() => setSeleccionada(null)}
          >
            <div className="text-4xl font-bold text-center">
              <div>{seleccionada.numerador}</div>
              <div>——</div>
              <div>{seleccionada.denominador}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DivisionApp;
