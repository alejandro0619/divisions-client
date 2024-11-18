import NumpadItem from "./Numpad";
import { DivisionOperation } from "../types";
import DropZone from "./Dropzones";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateDivisions, fetchDivisions, calculateResultLength } from "../utils";
import { useLocation } from "react-router-dom";
export default function Dashboard() {
  const location = useLocation();

  const [operations, setOperations] = useState<DivisionOperation[][]>([]);
  const [selectedOperation, setSelectedOperation] =
    useState<DivisionOperation | null>(null);
  const [result, setResult] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Track if the answer is correct
  // This should be improved for further code readability, but it works for now
  // Checks if the page is either 1,2 or 3, if not. sets the page as 1 by default.
  // This help us to drive the user flow to where we want, since we'll only be able to render 3 pages due to the
  // apps requirements. Although this works, it doesn't change the URL, so the user will still think it's page X 
  // but underneath it is not.
  const searchParams = new URLSearchParams(location.search);
  const page = ['1', '2', '3'].includes(searchParams.get('page') as string) ? searchParams.get('page') : '1';

  useEffect(() => {
    generateDivisions().then(() =>
      fetchDivisions().then((ops) => {
        if (ops) {
          console.log(ops);
          const result: DivisionOperation[][] = []; // Array para almacenar las divisiones agrupadas
          const chunkSize = 9; // Tamaño de cada grupo

          ops.forEach((op: DivisionOperation, idx: number) => {
            // Determinar en qué grupo debe ir la operación
            const groupIndex = Math.floor(idx / chunkSize);

            // Si no existe el grupo, inicializarlo
            if (!result[groupIndex]) {
              result[groupIndex] = [];
            }

            // Agregar la operación al grupo correspondiente
            result[groupIndex].push(op);
          });
          console.log(result);
          setOperations(result);
          /*
            Resultado esperado:
            [
              [<9 operations>],
              [<9 operations>],
              [<9 operations>],
            ]
          */
        }
      })
    );
  }, []);

  // Function to handle dropping a number at a specific position
  const handleDrop = (item: { number: string }, index: number) => {
    setResult((prevResult) => {
      // Insert the dropped number at the clicked position
      const newResult = [...prevResult];
      newResult.splice(index, 0, item.number); // Add number at the dropped position
      return newResult;
    });
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

    // Convierte el resultado ingresado en un número
    const enteredResult = parseInt(result.join(""), 10);

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
          result: enteredResult, // El resultado calculado
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setIsCorrect(true);
        console.log(data.message);
      } else {
        setIsCorrect(false);
        console.error(data.error);
      }
    } catch (error) {
      console.error("Error validando la respuesta:", error);
    }
  };

  return (
    <div className="p-4 w-screen h-screen bg-gradient-to-r from-gradientStart to-gradientEnd">
      <section className="relative flex w-full h-full justify-center items-center">
        <div className="grid grid-cols-3 gap-1 relative z-10 w-[650px] h-[650px]">
          {page === "1" &&
            operations[0] &&
            operations[0].map((operation) => (
              <button
                key={operation.id}
                onClick={() => {
                  setSelectedOperation(operation);
                  setResult([]);
                  setIsCorrect(null);
                }}
                className="border rounded-xl flex flex-col justify-center items-center mano_del_gocho bg-[#E6FFFA] opacity-95 m-2"
              >
                <span className="text-2xl font-bold">{operation.dividend}</span>
                <span className="text-xl">——</span>
                <span className="text-2xl font-bold">{operation.divisor}</span>
              </button>
            ))}

          {page === "2" &&
            operations[1] &&
            operations[1].map((operation) => (
              <button
                key={operation.id}
                onClick={() => {
                  setSelectedOperation(operation);
                  setResult([]);
                  setIsCorrect(null);
                }}
                className="border rounded-xl flex flex-col justify-center items-center mano_del_gocho bg-[#E6FFFA] opacity-95 m-2"
              >
                <span className="text-2xl font-bold">{operation.dividend}</span>
                <span className="text-xl">——</span>
                <span className="text-2xl font-bold">{operation.divisor}</span>
              </button>
            ))}

          {page === "3" &&
            operations[2] &&
            operations[2].map((operation) => (
              <button
                key={operation.id}
                onClick={() => {
                  setSelectedOperation(operation);
                  setResult([]);
                  setIsCorrect(null);
                }}
                className="border rounded-xl flex flex-col justify-center items-center mano_del_gocho bg-[#E6FFFA] opacity-95 m-2"
              >
                <span className="text-2xl font-bold">{operation.dividend}</span>
                <span className="text-xl">——</span>
                <span className="text-2xl font-bold">{operation.divisor}</span>
              </button>
            ))}
        </div>
        <img
          // Loads a different background image depending on the page the user is on.
          src={`${page == '1' ? 'cat.svg' : page == '2' ? 'dog.svg' : 'bunny.svg'}`}
          alt="no cargo lo siento mucho"
          className="absolute w-[650px] h-[650px] object-center opacity-50"
        />
      </section>
      <button
        onClick={generateDivisions}
        className="p-4 bg-blue-700 text-white rounded-lg mt-4 mx-auto block"
      >
        Generate Divisions
      </button>

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
                onClick={() =>
                  checkAnswer(selectedOperation, result, setIsCorrect)
                }
                className="p-4 bg-green-500 text-white rounded-lg w-1/3"
              >
                Check Answer
              </button>

              <button
                onClick={goBackToMain}
                className="p-4 bg-gray-500 text-white rounded-lg w-1/3"
              >
                Back
              </button>
            </div>

            {isCorrect !== null && (
              <div className="mt-4 text-xl font-semibold">
                {isCorrect ? "Correct Answer!" : "Incorrect Answer, Try Again!"}
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
