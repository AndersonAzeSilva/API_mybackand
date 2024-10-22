const express = require('express'); 
const { 
  registerUser, 
  updateProfile, 
  loginUser, 
  getAllUsers, 
  deleteUser 
} = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Definindo as rotas
router.post('/register', registerUser);
router.put('/:id', authMiddleware.verifyToken, updateProfile); // Usando verifyToken
router.post('/login', loginUser);
router.get('/', authMiddleware.verifyToken, getAllUsers); // Usando verifyToken
router.delete('/:id', authMiddleware.verifyToken, deleteUser); // Usando verifyToken

module.exports = router;
