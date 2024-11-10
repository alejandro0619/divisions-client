import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Define the type for each division operation
type DivisionOperation = {
  numerator: number;
  denominator: number;
};

// Function to generate division operations
const generateOperations = (count: number): DivisionOperation[] => {
  const operations: DivisionOperation[] = [];
  while (operations.length < count) {
    const numerator = Math.floor(Math.random() * 90) + 10;
    const denominator = Math.floor(Math.random() * 9) + 1;

    if (numerator % denominator === 0) {
      operations.push({ numerator, denominator });
    }
  }
  return operations;
};

// Type for Numpad item
type NumpadItemProps = {
  number: string;
};

// Component to represent a single numpad number as draggable
const NumpadItem: React.FC<NumpadItemProps> = ({ number }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'number',
    item: { number },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      className="w-12 h-12 m-2 flex items-center justify-center bg-gray-300 text-2xl font-bold rounded-md cursor-pointer"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {number}
    </div>
  );
};

// Main app component
const DivisionApp: React.FC = () => {
  const [operations, setOperations] = useState<DivisionOperation[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<DivisionOperation | null>(null);
  const [result, setResult] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Track if the answer is correct

  // Generate operations on page load
  useEffect(() => {
    setOperations(generateOperations(12));
  }, []);

  // Calculate the result of the operation
  const calculateResult = (operation: DivisionOperation): string => {
    const result = operation.numerator / operation.denominator;
    return result.toString();
  };

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
        {result[index] || '_'}
      </DropZone>
    ));
  };

  // Function to check if the result is correct
  const checkAnswer = () => {
    if (!selectedOperation) return;
    const correctAnswer = calculateResult(selectedOperation);
    const userAnswer = result.join('');
    setIsCorrect(userAnswer === correctAnswer);
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
            className="p-4 border rounded flex flex-col items-center"
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
            <div className="text-4xl font-bold text-center mb-4">
              <div>{selectedOperation.numerator}</div>
              <div>——</div>
              <div>{selectedOperation.denominator}</div>
            </div>

            {/* Render the drop zones dynamically based on result */}
            <div className="w-full h-20 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed">
              {renderDropZones(calculateResult(selectedOperation).length)}
            </div>

            <div className="flex justify-between items-center mt-4 w-full">
              <button
                onClick={checkAnswer}
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
                {isCorrect ? 'Correct Answer!' : 'Incorrect Answer, Try Again!'}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Numpad positioned at the center bottom */}
      {selectedOperation && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 bg-gray-100 rounded-lg shadow-lg">
          <div className="flex flex-wrap">
            {Array.from({ length: 10 }, (_, i) => (
              <NumpadItem key={i} number={i.toString()} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Component to create a droppable area
type DropZoneProps = {
  onDrop: (item: { number: string }, index: number) => void;
  children: React.ReactNode;
  index: number;
};

const DropZone: React.FC<DropZoneProps> = ({ onDrop, children, index }) => {
  const [, drop] = useDrop(() => ({
    accept: 'number',
    drop: (item: { number: string }) => onDrop(item, index), // Drop into the corresponding index
  }));

  return (
    <div
      ref={drop}
      className="w-16 h-16 flex justify-center items-center bg-gray-200 m-2 border border-dashed"
    >
      {children}
    </div>
  );
};

const App: React.FC = () => (
  <DndProvider backend={HTML5Backend}>
    <DivisionApp />
  </DndProvider>
);

export default App;
