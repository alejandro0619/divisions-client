import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the type for each division operation
type DivisionOperation = {
  numerator: number;
  denominator: number;
};

// Function to generate division operations
const generateOperations = (count: number): DivisionOperation[] => {
  const operations: DivisionOperation[] = [];
  while (operations.length < count) {
    const numerator = Math.floor(Math.random() * 90) + 10; // Generates number between 10 and 99
    const denominator = Math.floor(Math.random() * 9) + 1; // Generates number between 1 and 9 (avoids 0)
    
    // Ensures the division is exact
    if (numerator % denominator === 0) {
      operations.push({ numerator, denominator });
    }
  }
  return operations;
};

const DivisionApp: React.FC = () => {
  const [operations, setOperations] = useState<DivisionOperation[]>([]);
  const [selectedOperation, setSelectedOperation] = useState<DivisionOperation | null>(null);

  // Generate operations when the page loads
  useEffect(() => {
    setOperations(generateOperations(12)); // Generates 12 operations
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-cols-3 gap-4"> {/* 3-column grid */}
        {operations.map((operation, index) => (
          <button
            key={index}
            onClick={() => setSelectedOperation(operation)}
            className={`p-4 border rounded ${
              selectedOperation ? 'blur' : ''
            } flex flex-col items-center`}
          >
            <span className="text-2xl font-bold">{operation.numerator}</span>
            <span className="text-xl">——</span> {/* Fraction line */}
            <span className="text-2xl font-bold">{operation.denominator}</span>
          </button>
        ))}
      </div>

      {/* Pop-up for the selected operation */}
      <AnimatePresence>
        {selectedOperation && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm"
            onClick={() => setSelectedOperation(null)}
          >
            <div className="text-4xl font-bold text-center">
              <div>{selectedOperation.numerator}</div>
              <div>——</div>
              <div>{selectedOperation.denominator}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DivisionApp;
