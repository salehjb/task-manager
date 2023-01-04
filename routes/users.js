const { getUsers, getUserById, createUser, deleteUserById, updateUserById, updateProfileImage } = require('../controllers/users.controller');
const { autoLogin } = require('../middlewares/checkLogin');
const { upload } = require('../module/utils');

const userRouter = require('express').Router();

// get all users
userRouter.get("/", getUsers);

// get user profile
userRouter.get("/profile", autoLogin, (req, res, next) => {
    return res.json({ user: req.user })
});

// get user by id
userRouter.get("/:id", getUserById);

// create user
userRouter.post("/create", createUser);

// delete user by id
userRouter.delete("/:id", deleteUserById);

// update user by id
userRouter.put("/:id", updateUserById);

// update user profile image
userRouter.put("/profile/:id", upload.single("image"), updateProfileImage);

module.exports = userRouter;