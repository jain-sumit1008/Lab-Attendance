import { useState } from "react";
import API from "../services/api";   // ✅ FIX 1 (IMPORT)

export default function LabForm({ setLabInfo }) {

  const [form, setForm] = useState({
    lab: "",
    course: "",
    batch: "",
    date: "",
    time: ""
  });

  // ✅ SINGLE CORRECT FUNCTION
  const handleSubmit = async () => {
    try {
      await API.post("/lab", form);   // ✅ Save to DB
      setLabInfo(form);               // ✅ Update UI
      alert("Lab Info Saved ✅");
    } catch (err) {
      console.log(err);
      alert("Error saving lab info ❌");
    }
  };

  return (
    <div className="card">
      <h3>Edit Lab Info</h3>

      <input
        placeholder="Lab Name"
        onChange={e => setForm({ ...form, lab: e.target.value })}
      />

      <input
        placeholder="Course"
        onChange={e => setForm({ ...form, course: e.target.value })}
      />

      <input
        placeholder="Batch"
        onChange={e => setForm({ ...form, batch: e.target.value })}
      />

      <input
        type="date"
        onChange={e => setForm({ ...form, date: e.target.value })}
      />

      <input
        placeholder="Time"
        onChange={e => setForm({ ...form, time: e.target.value })}
      />

      <br /><br />

      {/* ✅ FIX 2: USE CORRECT FUNCTION */}
      <button className="btn-blue" onClick={handleSubmit}>
        Update
      </button>
    </div>
  );
}