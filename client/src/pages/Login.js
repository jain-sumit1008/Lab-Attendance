import { useState } from "react";
import API from "../services/api";
import "./register.css";

export default function Login() {
  const [role, setRole] = useState("student");
  const [data, setData] = useState({});

  const login = async () => {
    try {
      if (role === "student") {
        const res = await API.post("/auth/student/login", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("user", JSON.stringify(res.data.student));
        window.location.href = "/student";
      } else {
        const res = await API.post("/auth/admin/login", data);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("user", JSON.stringify(res.data.admin));
        window.location.href = "/AdminDashboard";
      }
    } catch (err) {
      console.log(err);
      alert("Invalid login ❌");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <div>
            <h2>Login</h2>
            <p>Access your student or faculty dashboard</p>
          </div>
          <span className="role-tag">{role === "student" ? "Student" : "Faculty"}</span>
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="admin">Faculty</option>
          </select>
        </div>

        <div className="form-group">
          <label>{role === "student" ? "Enrollment No" : "Username"}</label>
          <input
            className="form-input"
            placeholder={role === "student" ? "Enrollment number" : "Username"}
            onChange={(e) =>
              setData({
                ...data,
                [role === "student" ? "enrollment_no" : "username"]: e.target.value,
              })
            }
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        <button className="form-btn" onClick={login}>
          Login
        </button>

        <p className="form-footer">
          Don&apos;t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}