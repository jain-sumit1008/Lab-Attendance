import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Header from "./components/Header";
import InfoStrip from "./components/InfoStrip";
import Sidebar from "./components/Sidebar";
import Register from "./pages/register";
import AdminDashboard from "./pages/AdminDashboard";
import AttendancePage from "./pages/AttendancePage";
import ReportPage from "./pages/ReportPage";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";

import API from "./services/api"; // for backend (optional)

import "./App.css";

function App() {
const token = localStorage.getItem("token");
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

      {!token ? (

          <Routes>

      <Route
         path="/"
         element={<Login />}
      />

      <Route
         path="/register"
         element={<Register />}
      />

      <Route
         path="*"
         element={<Login />}
      />

   </Routes>
      ) : (

         <>
            <Header />

            <InfoStrip labInfo={labInfo} />

            <div className="app-layout">

               <Sidebar />

               <div className="main">
                  <Routes>
                     <Route
                        path="/attendance"
                        element={
                           <AttendancePage
                              labInfo={labInfo}
                              setLabInfo={setLabInfo}
                           />
                        }
                     />

                     <Route
                        path="/report"
                        element={<ReportPage />}
                     />

                     <Route
                        path="/AdminDashboard"
                        element={<AdminDashboard />}
                     />

                     <Route
                        path="/student"
                        element={<StudentDashboard />}
                     />

                  </Routes>

               </div>

            </div>
         </>

      )}

   </BrowserRouter>
);
  
}

export default App;