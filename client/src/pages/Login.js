import { useState } from "react";
import API from "../services/api";

export default function Login() {
  const [role, setRole] = useState("student");
  const [data, setData] = useState({});

  const login = async () => {

   try {

      if(role === "student") {

         const res = await API.post(
            "/auth/student/login",
            data
         );

         // STORE JWT
         localStorage.setItem(
            "token",
            res.data.token
         );

         // STORE ROLE
         localStorage.setItem(
            "role",
            res.data.role
         );

         // STORE USER DATA
         localStorage.setItem(
            "user",
            JSON.stringify(res.data.student)
         );

         // REDIRECT
         window.location.href = "/student";

      } else {

         const res = await API.post(
            "/auth/admin/login",
            data
         );

         // STORE JWT
         localStorage.setItem(
            "token",
            res.data.token
         );

         // STORE ROLE
         localStorage.setItem(
            "role",
            res.data.role
         );

         // STORE USER DATA
         localStorage.setItem(
            "user",
            JSON.stringify(res.data.admin)
         );

         // REDIRECT
         window.location.href =
            "/AdminDashboard";
      }

   } catch(err) {

      console.log(err);

      alert("Invalid login ❌");

   }
};

  return (
    <div style={{ padding: 50 }} id="jj">
      <h2>Login</h2>

      {/* ✅ ROLE SELECT */}
      <select onChange={e => setRole(e.target.value)}>
        <option value="student">Student</option>
        <option value="admin">Faculty</option>
      </select>

      <br /><br />

      {/* ✅ INPUTS CHANGE BASED ON ROLE */}
      {role === "student" ? (
        <>
          <input
            placeholder="Enrollment No"
            onChange={e =>
              setData({ ...data, enrollment_no: e.target.value })
            }
          />
        </>
      ) : (
        <>
          <input
            placeholder="Username"
            onChange={e =>
              setData({ ...data, username: e.target.value })
            }
          />
        </>
      )}

      <input
        type="password"
        placeholder="Password"
        onChange={e =>
          setData({ ...data, password: e.target.value })
        }
      />

      <br /><br />

      <button onClick={login}>Login</button>
    </div>
  );
}