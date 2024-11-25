const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes.js");
const adminRoutes = require("./routes/adminRoutes.js");
const pasienRoutes = require("./routes/pasienRoutes.js");
const dokterRoutes = require("./routes/dokterRoutes.js");
const staffRoutes = require("./routes/staffRoutes.js");
const cors = require("cors");

require("dotenv").config();
const db = require("./models");

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/pasien", pasienRoutes); 
app.use("/dokter", dokterRoutes); 
app.use("/staff", staffRoutes); 

app.listen(3000, () => {
  console.log("Server running on port 3000");
});