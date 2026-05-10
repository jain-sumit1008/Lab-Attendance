import { useState } from "react";

import API from "../services/api";

export default function Register() {

   const [role, setRole] =
      useState("student");

   const [data, setData] =
      useState({});

   const register = async () => {

      try {

         if(role === "student") {

            await API.post(
               "/auth/student/register",
               data
            );

            alert(
               "Student registered successfully ✅"
            );

         } else {

            await API.post(
               "/auth/admin/register",
               data
            );

            alert(
               "Faculty registered successfully ✅"
            );

         }

         window.location.href = "/";

      } catch(err) {

         console.log(err);

         alert("Registration failed ❌");

      }
   };

   return (

      <div style={{ padding: 50 }}>

         <h2>Register</h2>

         {/* ROLE SELECT */}
         <select
            onChange={(e) =>
               setRole(e.target.value)
            }
         >

            <option value="student">
               Student
            </option>

            <option value="admin">
               Faculty
            </option>

         </select>

         <br /><br />

         {/* STUDENT FORM */}
         {role === "student" && (

            <>

               <input
                  placeholder="Enrollment No"
                  onChange={(e) =>
                     setData({
                        ...data,
                        enrollment_no:
                           e.target.value
                     })
                  }
               />

               <br /><br />

               <input
                  placeholder="Name"
                  onChange={(e) =>
                     setData({
                        ...data,
                        name:
                           e.target.value
                     })
                  }
               />

               <br /><br />

               <input
                  placeholder="Branch"
                  onChange={(e) =>
                     setData({
                        ...data,
                        branch:
                           e.target.value
                     })
                  }
               />

               <br /><br />

               <input
                  placeholder="Class"
                  onChange={(e) =>
                     setData({
                        ...data,
                        class:
                           e.target.value
                     })
                  }
               />

               <br /><br />

               {/* <input
                  placeholder="System Type"
                  onChange={(e) =>
                     setData({
                        ...data,
                        system_type:
                           e.target.value
                     })
                  }
               /> */}

               <br /><br />

               <input
                  placeholder="Email"
                  onChange={(e) =>
                     setData({
                        ...data,
                        email:
                           e.target.value
                     })
                  }
               />

               <br /><br />

            </>

         )}

         {/* FACULTY FORM */}
         {role === "admin" && (

            <>

               <input
                  placeholder="Username"
                  onChange={(e) =>
                     setData({
                        ...data,
                        username:
                           e.target.value
                     })
                  }
               />

               <br /><br />

            </>

         )}

         {/* PASSWORD */}
         <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
               setData({
                  ...data,
                  password:
                     e.target.value
               })
            }
         />

         <br /><br />

         <button onClick={register}>
            Register
         </button>

      </div>

   );
}