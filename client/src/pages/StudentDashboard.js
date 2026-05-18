import {
   useEffect,
   useState
} from "react";

import API from "../services/api";

import "./StudentDashboard.css";

export default function StudentDashboard() {

   // =========================
   // USER DATA
   // =========================
   const student =
      JSON.parse(
         localStorage.getItem("user")
      );

   const role =
      localStorage.getItem("role");

   const [data, setData] =
      useState(null);

   const [loading, setLoading] =
      useState(true);


   // =========================
   // AUTH CHECK
   // =========================
   useEffect(() => {

      const token =
         localStorage.getItem("token");

      if(!token) {

         window.location.href = "/";

         return;
      }

      if(role !== "student") {

         window.location.href =
            "/AdminDashboard";

      }

   }, [role]);


   // =========================
   // FETCH REPORT
   // =========================
   useEffect(() => {

      const fetchReport =
         async () => {

            try {

               // FETCH ALL REPORTS
               const res =
                  await API.get(
                     "/attendance/report"
                  );

               // FIND LOGGED-IN STUDENT
               const loggedStudent =
                  res.data.find(

                     (s) =>

                        String(
                           s.enrollment_no
                        ) ===

                        String(
                           student.enrollment_no
                        )

                  );

               // STORE ONLY THAT STUDENT
               if(loggedStudent) {

                  setData(
                     loggedStudent
                  );

               } else {

                  console.log(
                     "Student report not found"
                  );

                  setData(null);

               }

            } catch(err) {

               console.log(err);

               alert(
                  "Failed to load attendance report"
               );

            } finally {

               setLoading(false);

            }
         };

      if(student) {

         fetchReport();

      }

   }, [student]);


   // =========================
   // LOGOUT
   // =========================
   const logout = () => {

      localStorage.clear();

      window.location.href = "/";
   };


   // =========================
   // LOADING
   // =========================
   if(loading) {

      return <h3>Loading...</h3>;

   }


   // =========================
   // NO DATA
   // =========================
   if(!data) {

      return (

         <div
            style={{
               padding: "20px"
            }}
         >

            <h2>

               Welcome,
               {" "}
               {student?.name}

            </h2>

            <p>
               No attendance data found.
            </p>

            <button
               onClick={logout}
            >
               Logout
            </button>

         </div>

      );
   }


   // =========================
   // MAIN UI
   // =========================
   return (

      <div className="student-dashboard">

         {/* TOP BAR */}
         <div className="top-bar">

            <h2>

               Welcome,
               {" "}
               {student.name}

            </h2>

            {/* <button
               className="logout-btn"
               onClick={logout}
            >
               Logout
            </button> */}

         </div>


         {/* ATTENDANCE CARD */}
         <div className="card">

            <h3>
               Present Days:
               {" "}
               {data.present_days}
            </h3>

            <h3>
               Total Classes:
               {" "}
               {data.total_classes}
            </h3>

            <h3>

               Attendance:
               {" "}

               {
                  parseFloat(
                     data.percentage
                  ).toFixed(2)
               }%

            </h3>

         </div>

      </div>
   );
}