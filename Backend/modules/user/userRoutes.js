const express = require('express');
const { getProfile,addUser,alluser,userByitsId,updateProfile } = require('./userController');
const authenticateToken = require('../../middlewares/authMiddleware');

const router = express.Router();

router.get('/profile', authenticateToken, getProfile);
router.put('/update/:userId', updateProfile);
router.post('/add', addUser);
router.get('/all', alluser);
router.get('/users/:userid',  userByitsId);

module.exports = router;
