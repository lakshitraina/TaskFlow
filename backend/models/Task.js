const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false }
}, { _id: true }); // keep _id for subtasks as well

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date, default: null },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['To Do', 'In Progress', 'In Review', 'Completed'], default: 'To Do' },
    category: { type: String, default: 'Work' },
    assignee: { type: String, default: null }, // could be populated later with User ref
    completed: { type: Boolean, default: false },
    subtasks: [subtaskSchema],
    focusTime: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);
