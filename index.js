const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const batchRoutes = require('./routes/batchRoutes.js');
const supabase = require('./config/supabase.js');  // Ensure this file is correctly set up

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/batches", batchRoutes);

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
