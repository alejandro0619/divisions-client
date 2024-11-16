import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Dashboard from "./components/Dashboard";
import { Navigate, Route, Routes } from "react-router-dom";
import Auth from "./Auth";

const DashboardComponent: React.FC = () => (
  <DndProvider backend={HTML5Backend}>
    <Dashboard />
  </DndProvider>
);

const App: React.FC = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/auth" />}/>
    <Route path="/dashboard" element={<DashboardComponent />} />
    <Route path="/auth" element={<Auth />} />
  </Routes>
);

export default App;
