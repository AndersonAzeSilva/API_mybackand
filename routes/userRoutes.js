const express = require('express');
const { registerUser, getAllUsers } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.get('/', authMiddleware, getAllUsers);

module.exports = router;
