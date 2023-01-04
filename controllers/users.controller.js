const { isValidObjectId } = require("mongoose");
const UserModel = require("../models/users");
const { hashString } = require("../module/utils");
const path = require("path");

async function getUsers(req, res, next) {
    try {
        const users = await UserModel.find({}, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 }).sort({ _id: -1 });
        return res.json(users);
    } catch (error) {
        next(error)
    }
}

async function getUserById(req, res, next) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw { status: 400, message: "enter the user id correctly" }
        const user = await UserModel.findOne({ _id: id }, { password: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        if (!user) throw { status: 404, message: "user not found!" }
        return res.json(user);
    } catch (error) {
        next(error)
    }
}

async function createUser(req, res, next) {
    try {
        const { username, password, email, mobile } = req.body;
        
        // mobile validator
        const mobileRegex = /^09[0-9]{9}/;
        if (!mobileRegex.test(mobile)) throw { status: 400, message: "the mobile number entered is incorrect" };
        // email validator
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(email)) throw { status: 400, message: "the email entered is incorrect" };
        // password validator
        if (password.length < 6 || password.length > 16) throw { status: 400, message: "password must be more than 6 and less than 16 characters" };

        let user;
        // check user exist by username
        user = await UserModel.findOne({ username });
        if (user) throw { status: 400, message: "username already exist!" };
        // check user exist by email
        user = await UserModel.findOne({ email });
        if (user) throw { status: 400, message: "email already exist!" };
        // check user exist by mobile
        user = await UserModel.findOne({ mobile });
        if (user) throw { status: 400, message: "mobile already exist!" };

        // hashed password
        const hashedPassword = hashString(password);

        // create user
        const createUser = await UserModel.create({
            username, password: hashedPassword, email, mobile
        });
        if (createUser) {
            return res.json(createUser)
        } else {
            throw { status: 500, message: "the desired user could not be created" }
        }
    } catch (error) {
        next(error)
    }
}

async function deleteUserById(req, res, next) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw { status: 400, message: "enter the user id correctly" };
        // user exist by id
        const user = await UserModel.findById(id);
        if (!user) throw { status: 404, message: "user not found!" };
        // delete user
        const deleteUser = await UserModel.deleteOne({ _id: id });
        if (deleteUser.deletedCount > 0) {
            return res.json({ status: 200, message: "user deleted successfully" })
        } else {
            throw { status: 500, message: "failed to delete user" }
        }
    } catch (error) {
        next(error)
    }
}

async function updateUserById(req, res, next) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw { status: 400, message: "enter the user id correctly" };

        // user exist by id
        const user = await UserModel.findById(id);
        if (!user) throw { status: 404, message: "user not found!" };

        // get body
        const { username, email, mobile } = req.body;
        const data = { ...req.body }
        
        // mobile validator
        const mobileRegex = /^09[0-9]{9}/;
        if (mobile && !mobileRegex.test(mobile)) throw { status: 400, message: "the mobile number entered is incorrect" };
        // email validator
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (email && !emailRegex.test(email)) throw { status: 400, message: "the email entered is incorrect" };

        let userExist;
        // check user exist by username
        if (username) userExist = await UserModel.findOne({ username });
        if (userExist) throw { status: 400, message: "username already exist!" };
        // check user exist by email
        if (email) userExist = await UserModel.findOne({ email });
        if (userExist) throw { status: 400, message: "email already exist!" };
        // check user exist by mobile
        if (mobile) userExist = await UserModel.findOne({ mobile });
        if (userExist) throw { status: 400, message: "mobile already exist!" };

        // datas validator
        Object.entries(data).forEach(([key, value]) => {
            if (!value || ["", " ", ".", null, undefined].includes(value)) {
                throw { status: 400, message: "please enter valid value" }
            } else if (!["username", "email", "mobile"].includes(key)) {
                throw { status: 400, message: "please enter valid keys" }
            }
        })

        // update user
        const updateUser = await UserModel.updateOne({ _id: id }, { ...data });
        if (updateUser.modifiedCount > 0) {
            return res.json({ status: 200, message: "user updated successfully" })
        } else {
            throw { status: 500, message: "failed to update user" }
        }
    } catch (error) {
        next(error)
    }
}

async function updateProfileImage(req, res, next) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) throw { status: 400, message: "enter the user id correctly" };

        // get perfix path
        const perfixPath = path.join(__dirname, "..");

        // check image exists
        let image
        if (req.file) {
            image = `${req.protocol}://${req.get("host")}${req.file.path.substring(perfixPath.length + 7).replace(/\\/g, "/")}`;
        } else {
            throw { status: 400, message: "please choose a file" }
        }

        // update user profile image
        const updateUserProfileImage = await UserModel.updateOne({ _id: id }, { $set: { profile_image: image } })
        if (updateUserProfileImage.modifiedCount > 0) {
            return res.json({
                status: 200,
                message: "profile image updated successfully",
            })
        } else {
            throw { status: 500, message: "failed to update user profile image" }
        }
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    deleteUserById,
    updateUserById,
    updateProfileImage,
}