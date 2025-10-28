import Task from '../models/Task.js';

export const getAllTasks = async (req, res) => {
    try {
        const tasks =  await Task.find().sort({ createdAt: -1 });
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Loi khi goi getAllTasks:", error);
        res.status(500).json({message: error.message});
    }
}

export const createTask = async (req, res) => {
    try
    {
        const { title } = req.body;
        const newTask = new Task({ title });

        const savedTask = await newTask.save();
        res.status(201).json(savedTask);
    }
    catch (error)
    {
        console.error("Loi khi tao nhiem vu:", error);
        res.status(500).json({message: error.message});
    }
}

export const updateTask = async (req, res) => {
    try {
        const { title, status,completed } = req.body;
        const updatedFields = await Task.findByIdAndUpdate(
            req.params.id,
            { title, status, completed },
            { new: true }
        );
        if (!updatedFields) {
            return res.status(404).json({ message: "Nhiem vu khong tim thay" });
        }
        res.status(200).json(updatedFields);
    }
    catch (error) {
        console.error("Loi khi cap nhat nhiem vu:", error);
        res.status(500).json({ message: error.message });
    }
}

export const deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({ message: "Nhiem vu khong tim thay" });
        }
        res.status(200).json({ message: "Nhiem vu da duoc xoa" });
    }
    catch (error) {
        console.error("Loi khi xoa nhiem vu:", error);
        res.status(500).json({ message: error.message });
    }
}