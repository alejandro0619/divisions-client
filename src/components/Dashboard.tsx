import NumpadItem from "./Numpad";
import { DivisionOperation } from "../types";
import DropZone from "./Dropzones";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateDivisions, fetchDivisions, calculateResultLength, handlePage, PAGE_ACTION } from "../utils";
import { useLocation } from "react-router-dom";
export default function Dashboard() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [operations, setOperations] = useState<DivisionOperation[][]>([]);
  const [selectedOperation, setSelectedOperation] =
    useState<DivisionOperation | null>(null);
  const [result, setResult] = useState<string[]>([]);
  const [completedOperations, setCompletedOperations] = useState(new Set<number>());// Tracks all the operations that were succesfully resolved. It tracks them by its ID

  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Track if the answer is correct
  // This should be improved for further code readability, but it works for now
  // Checks if the page is either 1,2 or 3, if not. sets the page as 1 by default.
  // This help us to drive the user flow to where we want, since we'll only be able to render 3 pages due to the
  // apps requirements. Although this works, it doesn't change the URL, so the user will still think it's page X 
  // but underneath it is not.
  const searchParams = new URLSearchParams(location.search);
  let page = [1, 2, 3].includes(parseInt(searchParams.get('page') as string)) ? parseInt(searchParams.get('page') as string) : 1;

  useEffect(() => {
    fetchDivisions().then((ops) => {
      if (ops) {
        console.log(ops);
        const result: DivisionOperation[][] = []; // Array to store the operations 
        const chunkSize = 9; // Size of the groups

        ops.forEach((op: DivisionOperation, idx: number) => {
          // Determine in which group the operation goes in
          const groupIndex = Math.floor(idx / chunkSize);

          // If the subgroup doesn't exist, create it
          if (!result[groupIndex]) {
            result[groupIndex] = [];
          }

          // Add the operation to its group
          result[groupIndex].push(op);
        });
        console.log(result);
        setOperations(result);

      }
    })
  }, []);

  // Function to handle tracking the functions that are completed.
  const markAsCompleted = (operationID: number) => {
    setCompletedOperations((prev) => new Set(prev).add(operationID))
  }

  // Function to handle dropping a number at a specific position
  const handleDrop = (item: { number: string }, index: number) => {
    setResult((prevResult) => {
      // Insert the dropped number at the clicked position
      const newResult = [...prevResult];
      newResult[index] = item.number
      return newResult;
    });
  };

  const handleGenerateDivisions = async () => {
    setLoading(true); 
    await generateDivisions(); // Generate divisions
    setLoading(false);
    window.location.reload(); 
  };


  // Function to render DropZones based on the result length
  const renderDropZones = (resultLength: number) => {
    return Array.from({ length: resultLength }, (_, index) => (
      <DropZone key={index} onDrop={handleDrop} index={index}>
        {result[index] || " "}
      </DropZone>
    ));
  };

  // Function to reset the screen
  const goBackToMain = () => {
    setSelectedOperation(null);
    setResult([]);
    setIsCorrect(null);
  };


  const checkAnswer = async (
    selectedOperation: DivisionOperation | null,
    result: string[],
    setIsCorrect: React.Dispatch<React.SetStateAction<boolean | null>>
  ) => {
    if (!selectedOperation) return;

    // Return the digits entered as numbers instead of string.
    const enteredResult = parseInt(result.filter((digit) => digit).join(""), 10);

    console.log(enteredResult)
    const correctResult =
      selectedOperation.dividend / selectedOperation.divisor;

    if (enteredResult !== correctResult) {
      setIsCorrect(false);
      console.error("Respuesta incorrecta");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/check-division", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          operation_id: selectedOperation.id,
          result: enteredResult, // The result calculated
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsCorrect(true);
        return true
      } else {
        console.error(data.error);
        setIsCorrect(false);
        return false

      }
    } catch (error) {
      console.error("Error validando la respuesta:", error);
    }
  };

  return (
    <div className="p-4 w-screen h-screen bg-gradient-to-r from-gradientStart to-gradientEnd overflow-hidden">
    <h1 className="text-center py-4 text-black text-4xl font-bold">
      ¡Aprendamos juntos!
    </h1>
    <section className="relative flex flex-col w-full h-[calc(100%-4rem)] justify-center items-center">
    {/*<section className="flex flex-col w-full h-full justify-center items-center">*/}
        <div className="grid grid-cols-3 gap-1 relative z-10 w-[650px] h-[650px]">
          {operations[page - 1]?.map((operation, idx) => {
            // Determina si la página actual está completada
            const isPageCompleted = operations[page - 1].every((op) => op.is_solved === 1);

            // Determina si la página anterior está completada
            const isPreviousPageCompleted = page === 1 || operations[page - 2]?.every((op) => op.is_solved === 1);

            // Verifica si el ejercicio está completado
            const isCompleted = operation.is_solved === 1;

            // Identifica si es la operación actual
            const isCurrent =
              operations[page - 1].findIndex((op) => op.is_solved === 0) === idx;

            // Bloquea el botón si no es completado, no es actual, o la página anterior no está completada
            const isLocked = !isPreviousPageCompleted || (!isCompleted && !isCurrent);

            return (
              <button
                key={operation.id}
                onClick={() => {
                  if (!isLocked) {
                    setSelectedOperation(operation);
                    setResult([]);
                    setIsCorrect(null);
                  }
                }}
                className={`border rounded-xl flex flex-col justify-center items-center mano_del_gocho bg-[#E6FFFA] opacity-95 m-2 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
              >
                {isLocked ? (
                  <span className="text-4xl">🔒</span>
                ) : isCompleted ? (
                  <span className="text-4xl">✔️</span>
                ) : (
                  <>
                    <span className="text-2xl font-bold">{operation.dividend}</span>
                    <span className="text-xl">——</span>
                    <span className="text-2xl font-bold">{operation.divisor}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>
        <img
          src={`${page === 1 ? 'cat.svg' : page === 2 ? 'dog.svg' : 'bunny.svg'}`}
          alt="no cargo lo siento mucho"
          className="absolute w-[650px] h-[650px] object-center opacity-50"
        />
      </section>



      {/* Upper right panel */}
      <section className="fixed right-5 top-2 bg-gray-200 p-4 w-fit h-fit rounded-xl flex flex-col gap-4">
        <h2 className="text-3xl text-center">
          Opciones
        </h2>
        <button
          onClick={() => {
            const confirmRegenerate = window.confirm(
              "Ten en cuenta que tu progreso actual se perderá. ¿Deseas continuar?"
            );
            if (confirmRegenerate) {
              handleGenerateDivisions();
            }
          }}
          className="p-4 bg-blue-700 text-white rounded-lg mt-5 mx-auto block"
        >
          {loading ? "Cargando..." : "Regenerar divisiones"}
        </button>
        <div className="flex gap-2 justify-center">
          <button className="w-20 h-10 text-center bg-gray-300 rounded-xl" onClick={() => handlePage(PAGE_ACTION.BACK, page)}>
            {"Volver"}
          </button>
          <button className="w-20 h-10 text-center bg-gray-300 rounded-xl" onClick={() => handlePage(PAGE_ACTION.NEXT, page)}>
            {"Siguiente"}
          </button>
        </div>
      </section>

      <AnimatePresence>
        {selectedOperation && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-r from-gradientStart to-gradientEnd backdrop-blur-sm z-20"
          >
            <div className="flex font-bold text-center mb-4 mano_del_gocho bg-gray-200 p-10 rounded-xl relative w-[650px] justify-center border-black">
              <div className="flex items-center gap-2  w-full rounded-xl p-4">
                <div className="absolute right-2 top-2 z-25 flex gap-2">
                  <span className="w-[20px] h-[20px] rounded-full bg-green-500 block" />
                  <span className="w-[20px] h-[20px] rounded-full bg-yellow-500 block" />
                  <span className="w-[20px] h-[20px] rounded-full bg-red-500 block" />
                </div>
                <span>
                  <div>{selectedOperation.dividend}</div>
                  <div>——</div>
                  <div>{selectedOperation.divisor}</div>
                </span>
                ={/* Render the drop zones dynamically based on result */}
                <div className="w-fit h-fit flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed">
                  {renderDropZones(calculateResultLength(selectedOperation))}
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center w-[400px] items-center mt-4 ">
              <button
                onClick={() => {
                  checkAnswer(selectedOperation, result, setIsCorrect).then((response) => {
                    if (response) {
                      // Si es correcto, márcalo como completado
                      markAsCompleted(selectedOperation.id);
                      setIsCorrect(true); // Actualiza el estado
                      window.location.reload()
                    } else {
                      setIsCorrect(false); // Respuesta incorrecta
                    }
                  });
                }}
                className="p-4 bg-green-500 text-white rounded-lg w-1/3"
              >
                Comprobar
              </button>


              <button
                onClick={goBackToMain}
                className="p-4 bg-gray-500 text-white rounded-lg w-1/3"
              >
                Volver
              </button>
            </div>

            {isCorrect !== null && (
              <div className="mt-4 text-xl font-semibold">
                {isCorrect ? "Respuesta Correcta!" : "Respuesta Incorrecta, Intenta de Nuevo!"}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Numpad positioned at the center bottom */}
      {selectedOperation && (
        <section className="w-full flex justify-center">
          <div className="fixed bottom-8  bg-gray-100 rounded-lg shadow-lg z-20">
            <div className="flex flex-wrap">
              {Array.from({ length: 10 }, (_, i) => (
                <NumpadItem key={i} number={i.toString()} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
