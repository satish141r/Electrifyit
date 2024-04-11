import { Class } from "@mui/icons-material";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Sidebar2 from "./components/Sidebar2";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="flex flex-row">
      <Sidebar2 />
    <Dashboard/>
      

    </div>
  );
}

export default App;
