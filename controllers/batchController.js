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

// ✅ Corrected Export
module.exports = { createBatch, getBatches, getBatchById, updateBatch, deleteBatch };
