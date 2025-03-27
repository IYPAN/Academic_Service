const supabase = require("../config/supabase.js");

const createCourse = async (req, res) => {
    const { course_name, type } = req.body;

    if (!course_name || !type) {
        return res.status(400).json({ error: "Course name and type are required" });
    }

    const { data, error } = await supabase
        .from("courses")
        .insert([{ course_name, type }])
        .select();

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({ message: "Course created successfully", course: data });
};

const deleteCourse = async (req, res) => {
    const { id } = req.params;

    const { error } = await supabase
        .from("courses")
        .delete()
        .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({ message: "Course deleted successfully" });
};

module.exports = { createCourse, deleteCourse };