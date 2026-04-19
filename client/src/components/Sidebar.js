import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <center>
        <img className="avatar" src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" />
        <h3>Prof. Sharma</h3>
      </center>

      <Link to="/" className="nav-btn">Dashboard</Link>
      <Link to="/attendance" className="nav-btn">Attendance</Link>
      <Link to="/report" className="nav-btn">Report</Link>
    </div>
  );
}