const express = require('express');
const router = express.Router();
const {
    getActivities,
    createActivity,
    clearActivities,
} = require('../controllers/activityController');

// GET all activities and POST a new activity
router.route('/')
    .get(getActivities)
    .post(createActivity)
    .delete(clearActivities);

module.exports = router;
