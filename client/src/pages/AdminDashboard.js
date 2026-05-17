import { useEffect, useState, useCallback } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [selectedLab, setSelectedLab] = useState("all");
  const [labs, setLabs] = useState([]);

  const fetchLabs = async () => {
    try {
      const res = await API.get("/labs");
      setLabs(res.data);
    } catch (err) {
      console.log("Failed to fetch labs:", err);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const url = selectedLab === "all" 
        ? "/attendance/today" 
        : `/attendance/today?lab=${selectedLab}`;
      const res = await API.get(url);
      setStudents(res.data);
    } catch (err) {
      console.log("Failed to fetch attendance:", err);
    }
  }, [selectedLab]);

  useEffect(() => {
    fetchLabs();
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      window.location.href = "/student";
    }
  }, []);

  // 📊 Calculations
  const total = students.length;
  const present = students.filter(s => s.status === "present").length;
  const percentage = total ? ((present / total) * 100).toFixed(2) : 0;

  return (
    <div>
      <h2>Dashboard</h2>

      {/* 🔹 Lab Selection Card */}
      <div className="card" style={{ marginBottom: "20px" }}>
        <h3>Select Lab</h3>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <select 
            value={selectedLab}
            onChange={(e) => setSelectedLab(e.target.value)}
            className="form-select"
            style={{ maxWidth: "250px" }}
          >
            <option value="all">All Labs</option>
            {labs.map((lab) => (
              <option key={lab._id} value={lab._id}>
                {lab.lab} - {lab.course}
              </option>
            ))}
          </select>
          <span style={{ color: "#5f6d86", fontSize: "14px" }}>
            Showing: <strong>{selectedLab === "all" ? "All Labs" : labs.find(l => l._id === selectedLab)?.lab || "Loading..."}</strong>
          </span>
        </div>
      </div>

      {/* 🔹 Cards */}
      <div className="card-row">
        <div className="card">Total Students: {total}</div>
        <div className="card">Present Today: {present}</div>
        <div className="card">Attendance: {percentage}%</div>
      </div>

      {/* 🔹 Table */}
      <div className="card">
        <h3>Student List</h3>

        <table>
          <thead>
            <tr>
              <th>Enrollment</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Class</th>
              <th>Sem/Year</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{s.enrollment_no}</td>
                <td>{s.name}</td>
                <td>{s.branch}</td>
                <td>{s.class}</td>
                <td>{s.sem}/{s.year}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}