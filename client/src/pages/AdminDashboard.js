import { useEffect, useState } from "react";
import API from "../services/api";

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
  const admin = localStorage.getItem("admin");

  if (!admin) {
    window.location.href = "/login";
  }
}, []);

  const fetchData = async () => {
    const res = await API.get("/attendance/today");
    setStudents(res.data);
  };

  // 📊 Calculations
  const total = students.length;
  const present = students.filter(s => s.status === "present").length;
  const percentage = total ? ((present / total) * 100).toFixed(2) : 0;

  return (
    <div>
      <h2>Dashboard</h2>

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
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((s, i) => (
              <tr key={i}>
                <td>{s.enrollment_no}</td>
                <td>{s.name}</td>
                <td>{s.branch}</td>
                <td>{s.class}</td>
                <td>
                  {s.status === "present" ? (
                    <span className="badge-good">Present</span>
                  ) : (
                    <span className="badge-low">Absent</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
}

<button onClick={() => {
  localStorage.clear();
  window.location.href = "/login";
}}>
  Logout
</button>