const Activity = require('../models/Activity');

// @desc    Get all activities (last 1000)
// @route   GET /api/activities
// @access  Public
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find().sort({ timestamp: -1 }).limit(1000);

        // Format for frontend compatibility
        const formattedActivities = activities.map(act => {
            const a = act.toObject();
            a.id = a._id.toString();
            return a;
        });

        res.status(200).json(formattedActivities);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new activity
// @route   POST /api/activities
// @access  Public
const createActivity = async (req, res) => {
    try {
        const activity = new Activity({
            action: req.body.action,
            taskTitle: req.body.taskTitle,
            timestamp: req.body.timestamp || Date.now()
        });

        const savedActivity = await activity.save();
        const a = savedActivity.toObject();
        a.id = a._id.toString();

        res.status(201).json(a);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Clear all activities
// @route   DELETE /api/activities
// @access  Public
const clearActivities = async (req, res) => {
    try {
        await Activity.deleteMany({});
        res.status(200).json({ message: 'All activities cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getActivities,
    createActivity,
    clearActivities,
};
