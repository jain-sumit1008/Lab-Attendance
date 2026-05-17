import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
export default function Sidebar() {
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const userRole = localStorage.getItem("role");
    setRole(userRole);
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setUserName(user.name || user.username || "User");
      } catch (err) {
        console.error("Error parsing user data:", err);
      }
    }
  }, []);

  const logout = () => {

   // CLEAR LOCAL STORAGE
   localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    // REDIRECT
    window.location.href = "/";

  };
  return (
    <div className="sidebar">
      <center>
        <img className="avatar" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="User avatar" />
        <h3>{userName}</h3>
      </center>

      {role === "admin" && (
        <>
          <Link to="/AdminDashboard" className="nav-btn">Dashboard</Link>
          <Link to="/attendance" className="nav-btn">Attendance</Link>
        </>
      )}
      <Link to="/report" className="nav-btn">Report</Link>
      <button onClick={logout} className="nav-btn logout-btn">Logout</button>
    </div>
  );
}