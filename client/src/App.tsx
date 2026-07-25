import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { Buy, Sell, Insights } from "./pages/Placeholders";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Home />} />
      <Route path="/buy" element={<Buy />} />
      <Route path="/sell" element={<Sell />} />
      <Route path="/insights" element={<Insights />} />
    </Routes>
  );
}

export default App;