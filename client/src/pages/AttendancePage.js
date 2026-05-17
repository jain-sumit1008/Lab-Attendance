import { useEffect, useState } from "react";

import API from "../services/api";

export default function AttendancePage() {

   const [students, setStudents] =
      useState([]);

   const [labInfo, setLabInfo] =
      useState(null);

   const [loading, setLoading] =
      useState(true);


   // AUTH CHECK
   useEffect(() => {

      const token =
         localStorage.getItem("token");

      if(!token) {

         window.location.href = "/";

      }

   }, []);


   // LOAD DATA
   useEffect(() => {

      loadLab();

   }, []);


   // LOAD LAB INFO
   const loadLab = async () => {

      try {

         const res = await API.get("/lab");

         if(res.data) {

            setLabInfo(res.data);

            if(res.data.batch) {

               loadStudents(
                  res.data.batch
               );

            }
         }

      } catch(err) {

         console.log(err);

         alert(
            "Failed to load lab info"
         );

      } finally {

         setLoading(false);

      }
   };


   // LOAD STUDENTS
   const loadStudents = async (batch) => {

      try {

         const res = await API.get(
            `/students/batch/${batch}`
         );

         setStudents(

            res.data.map((s) => ({
               ...s,
               status: ""
            }))

         );

      } catch(err) {

         console.log(err);

         alert(
            "Failed to load students"
         );

      }
   };


   // UPDATE STATUS
   const updateStatus = (
      index,
      value
   ) => {

      const updated = [...students];

      updated[index].status = value;

      setStudents(updated);
   };


   // SAVE ATTENDANCE
   const save = async () => {

      const unmarked =
         students.some(
            s => s.status === ""
         );

      if(unmarked) {

         alert(
            "Please mark attendance for all students!"
         );

         return;
      }

      try {

         await API.post(
            "/attendance/mark",
            {
               date:
                  new Date()
                  .toISOString()
                  .split("T")[0],

               attendance: students
            }
         );

         alert(
            "Attendance Saved Successfully ✅"
         );

      } catch(err) {

         console.log(err);

         alert(
            "Failed to save attendance ❌"
         );

      }
   };


   // LOADING STATE
   if(loading) {

      return <h3>Loading...</h3>;

   }


   return (

      <div>

         <h2>Attendance</h2>


         {/* LAB INFO */}
         {labInfo && (

            <div
               style={{
                  marginBottom: "20px"
               }}
            >

               <p>
                  <b>Lab:</b>
                  {" "}
                  {labInfo.lab}
               </p>

               <p>
                  <b>Course:</b>
                  {" "}
                  {labInfo.course}
               </p>

               <p>
                  <b>branch:</b>
                  {" "}
                  {labInfo.batch}
               </p>

               <p>
                  <b>Date:</b>
                  {" "}
                  {labInfo.date}
               </p>

               <p>
                  <b>Time:</b>
                  {" "}
                  {labInfo.time}
               </p>

            </div>

         )}


         {/* SAVE BUTTON */}
         <button
            className="btn-blue"
            onClick={save}
         >
            Save Attendance
         </button>

         <br />
         <br />


         {/* TABLE */}
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

                     <td>
                        {s.enrollment_no}
                     </td>

                     <td
                        style={{
                           fontWeight: "500"
                        }}
                     >
                        {s.name}
                     </td>

                     <td>

                        <button
                           className={
                              s.status === "present"
                              ? "present"
                              : ""
                           }

                           onClick={() =>
                              updateStatus(
                                 i,
                                 "present"
                              )
                           }
                        >
                           Present
                        </button>


                        <button
                           className={
                              s.status === "absent"
                              ? "absent"
                              : ""
                           }

                           onClick={() =>
                              updateStatus(
                                 i,
                                 "absent"
                              )
                           }
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