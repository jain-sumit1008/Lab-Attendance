import { useEffect, useState } from "react";
import API from "../services/api";

export default function StudentDashboard() {
  const student = JSON.parse(localStorage.getItem("student"));
  const [data, setData] = useState(null);

  useEffect(() => {
    API.get("/attendance/report").then(res => {
      const me = res.data.find(s => s.enrollment_no === student.enrollment_no);
      setData(me);
    });
  }, []);
  

  if (!data) return <h3>Loading...</h3>;

  return (
    <div>
      <h2>Welcome {student.name}</h2>
      <div className="card">
        <h3>Present: {data.present_days}</h3>
        <h3>Total: {data.total_classes}</h3>
        <h3>Attendance: {parseFloat(data.percentage).toFixed(2)}%</h3>
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
// useEffect(() => {
//   const student = localStorage.getItem("student");

//   if (!student) {
//     window.location.href = "/login";
//   }
// }, []);