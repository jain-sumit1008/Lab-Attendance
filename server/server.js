const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/students", require("./routes/studentRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/lab", require("./routes/labRoutes"));

app.listen(5000, () => {
    console.log("Server running on http://localhost:5000 🚀");
});