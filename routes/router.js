const userRouter = require('./users');
const authRouter = require('./auth');
const taskRouter = require('./tasks');
const { autoLogin } = require('../middlewares/checkLogin');

const router = require('express').Router();

router.use("/users", userRouter);
router.use("/auth", authRouter);
router.use("/tasks", autoLogin, taskRouter);

module.exports = router;