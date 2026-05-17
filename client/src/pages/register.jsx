import { useState } from "react";
import API from "../services/api";
import "./register.css";

export default function Register() {
  const [role, setRole] = useState("student");
  const [data, setData] = useState({});

  const register = async () => {
    try {
      if (role === "student") {
        await API.post("/auth/student/register", data);
      } else {
        await API.post("/auth/admin/register", data);
      }

      alert("Registration Successful ✅");
      window.location.href = "/";
    } catch (err) {
      console.log(err);
      alert("Registration Failed ❌");
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <div>
            <h2>Register</h2>
            <p>Create your student or faculty account</p>
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

        {role === "student" ? (
          <>
            <div className="form-group">
              <label>Enrollment No</label>
              <input
                className="form-input"
                placeholder="Enter enrollment number"
                onChange={(e) =>
                  setData({ ...data, enrollment_no: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Name</label>
              <input
                className="form-input"
                placeholder="Full name"
                onChange={(e) => setData({ ...data, name: e.target.value })}
              />
            </div>
            <div className="form-row">
              <div className="form-group half-width">
                <label>Branch</label>
                <input
                  className="form-input"
                  placeholder="Branch"
                  onChange={(e) => setData({ ...data, branch: e.target.value })}
                />
              </div>
              <div className="form-group half-width">
                <label>Class</label>
                <input
                  className="form-input"
                  placeholder="Class"
                  onChange={(e) => setData({ ...data, class: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                className="form-input"
                type="email"
                placeholder="Email address"
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
          </>
        ) : (
          <div className="form-group">
            <label>Username</label>
            <input
              className="form-input"
              placeholder="Faculty username"
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </div>
        )}

        <div className="form-group">
          <label>Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Choose a secure password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        <button className="form-btn" onClick={register}>
          Register
        </button>

        <p className="form-footer">
          Already have an account? <a href="/">Login</a>
        </p>
      </div>
    </div>
  );
}