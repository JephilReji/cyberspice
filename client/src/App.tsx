import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Insights from "./pages/Insights";
import ListingDetail from "./pages/ListingDetail";
import NewsArticle from "./pages/NewsArticle";

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
      <Route path="/listing/:id" element={<ListingDetail />} />
      <Route path="/news/:articleId" element={<NewsArticle />} />
    </Routes>
  );
}

export default App;