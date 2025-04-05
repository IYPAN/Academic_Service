const supabase = require("../config/supabase.js");

const createBatch = async (req, res) => {
    const { batch_name, language, type, duration, center, teacher } = req.body;

    const { data, error } = await supabase
        .from("batches")
        .insert([{ batch_name, language, type, duration, center, teacher }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Batch created successfully", batch: data });
};

const getBatches = async (req, res) => {
    const { data, error } = await supabase.from("batches").select("*");

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
};

const getBatchById = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase.from("batches").select("*").eq("batch_id", id).single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
};

const updateBatch = async (req, res) => {
    const { id } = req.params;
    const { batch_name, language, type, duration, center, teacher } = req.body;

    const { data, error } = await supabase
        .from("batches")
        .update({ batch_name, language, type, duration, center, teacher })
        .eq("batch_id", id)
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Batch updated successfully", batch: data });
};

const deleteBatch = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase.from("batches").delete().eq("batch_id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Batch deleted successfully" });
};
const approveStudent = async (req, res) => {
    const { student_id } = req.body;

    if (!student_id) {
        return res.status(400).json({ error: "Student ID is required" });
    }

    // Fetch student details including state and center info
    const { data: student, error: fetchError } = await supabase
        .from("students")
        .select(`state:states(state_name), center:centers(center_name), status`)
        .eq("student_id", student_id)
        .single();

    if (fetchError || !student) {
        return res.status(400).json({ error: "Student not found or database error" });
    }

    if (student.status) {
        return res.status(400).json({ error: "Student is already approved" });
    }

    // Extract first two letters of state and center in uppercase
    const stateCode = student.state?.state_name?.slice(0, 2).toUpperCase() || "XX";
    const centerCode = student.center?.center_name?.slice(0, 2).toUpperCase() || "YY";

    // Generate a random 4-digit number (1000-9999)
    const nextNumber = Math.floor(1000 + Math.random() * 9000);

    // Correct format: ISML + StateCode + CenterCode + 4-digit random number
    const registrationNumber = `ISML${stateCode}${centerCode}${nextNumber}`;

    // Approve the student and update registration number
    const { data, error } = await supabase
        .from("students")
        .update({ status: true, registration_number: registrationNumber })
        .eq("student_id", student_id)
        .select();

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    res.json({ message: "Student approved successfully", student: data });
};

// ✅ Corrected Export
module.exports = { createBatch, getBatches, getBatchById, updateBatch, deleteBatch, approveStudent };
