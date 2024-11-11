import { useDrag } from "react-dnd";

export default function Numpad({ number }: { number: string }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "number",
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
}
