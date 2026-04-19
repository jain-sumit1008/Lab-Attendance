import { useEffect, useState } from "react";
import API from "../services/api";

export default function AttendancePage() {
  const [students, setStudents] = useState([]);
  const [labInfo, setLabInfo] = useState(null);

  // ✅ Load lab + students
  useEffect(() => {
    loadLab();
  }, []);

  const loadLab = async () => {
    try {
      const res = await API.get("/lab");

      if (res.data) {
        setLabInfo(res.data);

        if (res.data.batch) {
          loadStudents(res.data.batch);
        }
      }
    } catch (err) {
      console.log("Error loading lab info");
    }
  };

  // ✅ Load students based on batch
  const loadStudents = async (batch) => {
    try {
      const res = await API.get(`/students/batch/${batch}`);

      setStudents(
        res.data.map(s => ({
          ...s,
          status: ""
        }))
      );
    } catch (err) {
      console.log("Error loading students");
    }
  };

  // ✅ Update status
  const updateStatus = (index, value) => {
    const updated = [...students];
    updated[index].status = value;
    setStudents(updated);
  };

  // ✅ Save attendance
  const save = async () => {
    const unmarked = students.some(s => s.status === "");

    if (unmarked) {
      alert("Please mark attendance for all students!");
      return;
    }

    await API.post("/attendance/mark", {
      date: new Date().toISOString().split("T")[0],
      attendance: students
    });

    alert("Attendance Saved Successfully ✅");
  };

  return (
    <div>
      <h2>Attendance</h2>

      {/* ✅ Show full lab info */}
      {labInfo && (
        <div style={{ marginBottom: "10px" }}>
          <p><b>Lab:</b> {labInfo.lab}</p>
          <p><b>Course:</b> {labInfo.course}</p>
          <p><b>Batch:</b> {labInfo.batch}</p>
          <p><b>Date:</b> {labInfo.date}</p>
          <p><b>Time:</b> {labInfo.time}</p>
        </div>
      )}

      <button className="btn-blue" onClick={save}>
        Save Attendance
      </button>

      <br /><br />

      <table>
        <thead>
          <tr>
            <th>Enrollment No</th>
            <th>Student Name</th>
            <th>Attendance</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s, i) => (
            <tr key={i}>
              <td>{s.enrollment_no}</td>

              <td style={{ fontWeight: "500" }}>
                {s.name}
              </td>

              <td>
                <button
                  className={s.status === "present" ? "present" : ""}
                  onClick={() => updateStatus(i, "present")}
                >
                  Present
                </button>

                <button
                  className={s.status === "absent" ? "absent" : ""}
                  onClick={() => updateStatus(i, "absent")}
                >
                  Absent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}