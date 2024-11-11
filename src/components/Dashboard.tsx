import NumpadItem from "./Numpad";
import {
  generateOperations,
  DivisionOperation,
  calculateResult,
  checkAnswer,
} from "../utils";
import DropZone from "./Dropzones";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { section } from "framer-motion/client";

export default function Dashboard() {
  const [operations, setOperations] = useState<DivisionOperation[]>([]);
  const [selectedOperation, setSelectedOperation] =
    useState<DivisionOperation | null>(null);
  const [result, setResult] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Track if the answer is correct

  // Generate operations on page load
  useEffect(() => {
    setOperations(generateOperations(12));
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

  // Function to render the drop zones based on the length of the result
  const renderDropZones = (resultLength: number) => {
    return Array.from({ length: resultLength }, (_, index) => (
      <DropZone key={index} onDrop={handleDrop} index={index}>
        {result[index] || "❓"}
      </DropZone>
    ));
  };

  // Function to reset the screen
  const goBackToMain = () => {
    setSelectedOperation(null);
    setResult([]);
    setIsCorrect(null);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4">
        {operations.map((operation, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedOperation(operation);
              setResult([]); // Reset result on new selection
              setIsCorrect(null); // Reset correctness
            }}
            className="p-4 border rounded flex flex-col items-center mano_del_gocho"
          >
            <span className="text-2xl font-bold">{operation.numerator}</span>
            <span className="text-xl">——</span>
            <span className="text-2xl font-bold">{operation.denominator}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {selectedOperation && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <div className="font-bold text-center mb-4 mano_del_gocho">
              <div>{selectedOperation.numerator}</div>
              <div>——</div>
              <div>{selectedOperation.denominator}</div>
            </div>

            {/* Render the drop zones dynamically based on result */}
            <div className="w-fit h-20 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed">
              {renderDropZones(calculateResult(selectedOperation).length)}
            </div>

            <div className="flex gap-4 justify-center w-[400px] items-center mt-4 ">
              <button
                onClick={() =>
                  checkAnswer({ selectedOperation, result, setIsCorrect })
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
        <div className="fixed bottom-8  bg-gray-100 rounded-lg shadow-lg">
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
