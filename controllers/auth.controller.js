const UserModel = require("../models/users");
const { hashString, compareStringWithHash, generateToken } = require("../module/utils");

async function regsiter(req, res, next) {
    try {
        const { email, username, mobile, password, confirm_password } = req.body;

        // mobile validator
        const mobileRegex = /^09[0-9]{9}/;
        if (!mobileRegex.test(mobile)) throw { status: 400, message: "the mobile number entered is incorrect" };
        // email validator
        const emailRegex = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        if (!emailRegex.test(email)) throw { status: 400, message: "the email entered is incorrect" };
        // password validator
        if (password.length < 6 || password.length > 16) throw { status: 400, message: "password must be more than 6 and less than 16 characters" };
        if (password !== confirm_password) throw { status: 400, message: "password not equal to confirm password" };

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

        const createUser = await UserModel.create({
            email, username, mobile, password: hashedPassword
        });
        if (createUser) {
            res.json({
                status: 201,
                message: "your account has been successfully created"
            });
        } else {
            throw { status: 500, message: "your account creation failed" };
        }
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        // find user by username
        const user = await UserModel.findOne({ username });
        console.log(user);
        if (!user) throw { status: 401, message: "username or password is not correct" };

        // compare the entered password with the user's password
        if (!compareStringWithHash(password, user.password)) throw { status: 401, message: "username or password is not correct" };

        // generate token
        const token = generateToken(user);
        user.token = token;
        user.save();

        return res.json({
            status: 200,
            message: "you have successfully logged into your account"
        })
    } catch (error) {
        next(error);
    }
}

async function resetPassword(req, res, next) {
    try {

    } catch (error) {
        next(error);
    }
}

module.exports = {
    regsiter,
    login,
    resetPassword,
}