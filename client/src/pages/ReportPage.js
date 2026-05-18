import { useEffect, useState } from "react";
import API from "../services/api";

export default function ReportPage() {

   const [data, setData] = useState([]);

   const [date, setDate] = useState("");
   const [lab, setLab] = useState("");
   const [time, setTime] = useState("");

   // Load latest report initially
   useEffect(() => {

      fetchReport();

   }, []);

   const fetchReport = async () => {

      try {

         const res = await API.get(
            "/attendance/report/filter",
            {
               params: {
                  date,
                  lab,
                  time
               }
            }
         );

         console.log(res.data);

         setData(res.data);

      } catch (err) {

         console.log(err.response?.data || err);

      }

   };

   return (

      <div className="report-page">

         <h2>Attendance Report</h2>

         {/* FILTERS */}

         <div
            style={{
               display: "flex",
               gap: "10px",
               marginBottom: "20px",
               flexWrap: "wrap"
            }}
         >

            <input
               type="date"
               value={date}
               onChange={(e) => setDate(e.target.value)}
            />

            <input
               type="text"
               placeholder="Enter Lab Name"
               value={lab}
               onChange={(e) => setLab(e.target.value)}
            />

            <input
               type="text"
               placeholder="Enter Time"
               value={time}
               onChange={(e) => setTime(e.target.value)}
            />

            <button onClick={fetchReport}>
               Search
            </button>

         </div>

         {/* TABLE */}

         <table
            border="1"
            cellPadding="10"
            width="100%"
         >

            <thead>

               <tr>

                  <th>Name</th>
                  <th>Enrollment</th>
                  <th>Email</th>
                  <th>Branch</th>
                  <th>Lab</th>
                  <th>Time</th>
                  <th>Date</th>
                  <th>Status</th>

               </tr>

            </thead>

            <tbody>

               {data.length > 0 ? (

                  data.map((s, i) => (

                     <tr key={i}>

                        <td>{s.name}</td>

                        <td>{s.enrollment_no}</td>

                        <td>{s.email}</td>

                        <td>{s.branch}</td>

                        <td>{s.lab}</td>

                        <td>{s.time}</td>

                        <td>
                           {s.date
                              ? new Date(s.date)
                                   .toLocaleDateString()
                              : "-"}
                        </td>

                        <td>

                           {s.status === "present" ? (

                              <span
                                 style={{
                                    color: "green",
                                    fontWeight: "bold"
                                 }}
                              >
                                 Present
                              </span>

                           ) : (

                              <span
                                 style={{
                                    color: "red",
                                    fontWeight: "bold"
                                 }}
                              >
                                 Absent
                              </span>

                           )}

                        </td>

                     </tr>

                  ))

               ) : (

                  <tr>

                     <td colSpan="8">
                        No Data Found
                     </td>

                  </tr>

               )}

            </tbody>

         </table>

      </div>

   );

}