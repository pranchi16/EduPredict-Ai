import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import Students from "./pages/Students/Students";
import AddStudent from "./pages/Students/AddStudent";
import StudentDetails from "./pages/Students/StudentDetails";
import Prediction from "./pages/Prediction/Prediction";
import Analytics from "./pages/Analytics/Analytics";
import Upload from "./pages/Upload/Upload";
import AppLayout from "./components/AppLayout";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/students/add" element={<AddStudent />} />
        <Route path="/students/:id" element={<StudentDetails />} />
        <Route path="/prediction" element={<Prediction />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/upload" element={<Upload />} />
      </Route>
    </Routes>
  );
}