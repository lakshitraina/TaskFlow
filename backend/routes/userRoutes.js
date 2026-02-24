const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, loginUser } = require('../controllers/userController');

router.post('/login', loginUser);

router.route('/')
    .get(getUsers)
    .post(createUser);

router.route('/:id')
    .put(updateUser)
    .delete(deleteUser);

module.exports = router;
