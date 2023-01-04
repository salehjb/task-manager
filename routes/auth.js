const { regsiter, login, resetPassword } = require('../controllers/auth.controller');

const authRouter = require('express').Router();

// user registration
authRouter.post("/register", regsiter);

// user login
authRouter.post("/login", login);

// recover user password
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;