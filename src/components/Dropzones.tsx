import { useDrop } from "react-dnd";

type DropZoneProps = {
  onDrop: (item: { number: string }, index: number) => void;
  children: React.ReactNode;
  index: number;
};

export default function Dropzone({ onDrop, children, index }: DropZoneProps) {

    const [, drop] = useDrop(() => ({
        accept: 'number',
        drop: (item: { number: string }) => onDrop(item, index), // Drop into the corresponding index
      }));
    
      return (
        <div
          ref={drop}
          className="w-[100px] h-[100px] flex justify-center items-center bg-gray-200 m-2 border border-dashed"
        >
          {children}
        </div>
      );
}
