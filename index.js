const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const batchRoutes = require("./routes/batchRoutes.js");
const notesRoutes = require("./routes/notesRoutes.js");
const gmeetRoutes = require("./routes/gmeetRoutes.js");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/batches", batchRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/gmeets", gmeetRoutes); 

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
