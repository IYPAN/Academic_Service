const supabase = require("../config/supabase.js");

const createBatch = async (req, res) => {
    const { batch_name, duration, center, teacher, course_id } = req.body;

    // Update required fields check
    if (!batch_name || !duration || !center || !teacher || !course_id) {
        return res.status(400).json({ 
            error: "All fields are required: batch_name, duration, center, teacher, course_id" 
        });
    }

    try {
        // First verify if the course exists
        const { data: courseExists, error: courseError } = await supabase
            .from("courses")
            .select("id")
            .eq("id", course_id)
            .single();

        if (courseError || !courseExists) {
            return res.status(400).json({ error: "Invalid course ID" });
        }

        // Create batch with updated fields
        const { data, error } = await supabase
            .from("batches")
            .insert([{ 
                batch_name, 
                duration, 
                center, 
                teacher, 
                course_id
            }])
            .select(`
                *,
                course:courses(id, course_name, type)
            `)
            .single();

        if (error) {
            console.error("Database error:", error);
            return res.status(400).json({ error: error.message });
        }

        res.status(201).json({ 
            message: "Batch created successfully", 
            batch: {
                ...data,
                course_name: data.course?.course_name,
                course_type: data.course?.type
            }
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getBatches = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("batches")
            .select(`
                *,
                center_details:centers(center_id, center_name),
                teacher_details:teachers!inner(
                    teacher_info:users(id, name)
                ),
                course:courses(id, course_name, type)
            `);

        if (error) {
            console.error("Database error:", error);
            return res.status(400).json({ error: error.message });
        }

        // Update transformed data to use course type from courses table
        const transformedData = data.map(batch => ({
            ...batch,
            center_name: batch.center_details?.center_name,
            teacher_name: batch.teacher_details?.teacher_info?.name,
            course_name: batch.course?.course_name,
            course_type: batch.course?.type,
            // Remove the nested objects
            center_details: undefined,
            teacher_details: undefined,
            course: undefined
        }));

        res.json({
            success: true,
            data: transformedData
        });
    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ 
            success: false,
            error: "Internal server error" 
        });
    }
};

const getBatchById = async (req, res) => {
    const { id } = req.params;

    const { data, error } = await supabase
        .from("batches")
        .select(`
            *,
            course:courses(id, course_name)
        `)
        .eq("batch_id", id)
        .single();

    if (error) return res.status(400).json({ error: error.message });

    res.json(data);
};

const updateBatch = async (req, res) => {
    const { id } = req.params;
    const { batch_name, duration, center, teacher, course_id } = req.body;

    const { data, error } = await supabase
        .from("batches")
        .update({ batch_name, duration, center, teacher, course_id })
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
