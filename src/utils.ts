export type DivisionOperation = {
  numerator: number;
  denominator: number;
};

export function generateOperations(count: number) {
  const operations: DivisionOperation[] = [];
  while (operations.length < count) {
    const numerator = Math.floor(Math.random() * 90) + 10;
    const denominator = Math.floor(Math.random() * 9) + 1;

    if (numerator % denominator === 0) {
      operations.push({ numerator, denominator });
    }
  }
  return operations;
}

// ------------------------------------

// Calculate the result of the operation
export const calculateResult = (operation: DivisionOperation): string => {
  const result = operation.numerator / operation.denominator;
  return result.toString();
};

export const checkAnswer = ({selectedOperation, result, setIsCorrect}: {
    selectedOperation: DivisionOperation | null;
    result: string[];
    setIsCorrect: (isCorrect: boolean) => void;
}) => {
  if (!selectedOperation) return;
  const correctAnswer = calculateResult(selectedOperation);
  const userAnswer = result.join('');
  setIsCorrect(userAnswer === correctAnswer);
};
