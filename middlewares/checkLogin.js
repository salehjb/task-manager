const { request } = require("express");
const UserModel = require("../models/users");
const { verifyToken } = require("../module/utils");

async function autoLogin(req, res, next) {
    try {
        req.user = undefined;
        req.isLoggedIn = false;

        const headers = req.headers;

        // get token from request headers
        const token = headers.authorization.split(" ")[1];
        if (!token) throw { status: 401, message: "please login to your account" };

        const payload = verifyToken(token);

        // get user by token
        const user = await UserModel.findOne({ username: payload.username }, { password: 0, createdAt: 0, updatedAt: 0, __v: 0, token: 0 });
        if (!user) throw { status: 401, message: "please login to your account" };

        req.user = user;
        req.isLoggedIn = true;

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    autoLogin,
}