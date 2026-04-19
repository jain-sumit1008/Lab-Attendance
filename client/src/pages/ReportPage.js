import { useEffect, useState } from "react";
import API from "../services/api";

export default function ReportPage() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/attendance/report").then(res => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Report</h2>

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Present</th>
            <th>Total</th>
            <th>%</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.map((s, i) => {
            const p = parseFloat(s.percentage || 0);
            return (
              <tr key={i}>
                <td>{s.name}</td>
                <td>{s.present_days}</td>
                <td>{s.total_classes}</td>
                <td>{p.toFixed(2)}%</td>
                <td>
                  {p < 75 ? (
                    <span className="badge-low">Shortage</span>
                  ) : (
                    <span className="badge-good">Good</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}