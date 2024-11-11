import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Dashboard from "./components/Dashboard";
const App: React.FC = () => (
  <DndProvider backend={HTML5Backend}>
    <Dashboard />
  </DndProvider>
);

export default App;
