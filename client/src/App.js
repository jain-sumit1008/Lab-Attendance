import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import InfoStrip from "./components/InfoStrip";
import Sidebar from "./components/Sidebar";
import LabForm from "./components/LabForm"; // NEW

import AdminDashboard from "./pages/AdminDashboard";
import AttendancePage from "./pages/AttendancePage";
import ReportPage from "./pages/ReportPage";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";

import API from "./services/api"; // for backend (optional)

import "./App.css";

function App() {

  // 🔹 1. STATE (IMPORTANT)
  const [labInfo, setLabInfo] = useState({
    lab: "NIL",
    course: "A8C-471",
    batch: "5",
    date: new Date().toISOString().split("T")[0],
    time: "1:45 - 4:45"
  });

  // 🔹 2. LOAD FROM BACKEND (optional but recommended)
  useEffect(() => {
    API.get("/lab")
      .then(res => {
        if (res.data) setLabInfo(res.data);
      })
      .catch(() => console.log("No lab data yet"));
  }, []);

  return (
    <BrowserRouter>

      <Header />

      {/* 🔹 3. PASS DATA HERE */}
      <InfoStrip labInfo={labInfo} />

      <div className="app-layout">
        <Sidebar />

        <div className="main">

          {/* 🔹 4. OPTIONAL FORM (only for admin) */}
          <LabForm setLabInfo={setLabInfo} />

          <Routes>
            <Route path="/" element={<AdminDashboard />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/student" element={<StudentDashboard />} />
          </Routes>

        </div>
      </div>
             
    </BrowserRouter>
  );
}

export default App;