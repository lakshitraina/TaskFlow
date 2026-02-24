const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        // Map _id to id for frontend compatibility
        const formattedTasks = tasks.map(task => {
            const t = task.toObject();
            t.id = t._id.toString();
            if (t.subtasks) {
                t.subtasks = t.subtasks.map(st => {
                    st.id = st._id ? st._id.toString() : st.id;
                    return st;
                });
            }
            return t;
        });
        res.status(200).json(formattedTasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        const savedTask = await task.save();

        const t = savedTask.toObject();
        t.id = t._id.toString();
        res.status(201).json(t);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        const t = task.toObject();
        t.id = t._id.toString();
        res.status(200).json(t);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.status(200).json({ id: req.params.id, message: 'Task removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
};
