const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const jwt = require("jsonwebtoken");
const { EXPIRES_IN } = require('../configs/constants');

function hashString(str) {
    const salt = bcrypt.genSaltSync(10);
    const hashed = bcrypt.hashSync(str, salt);
    return hashed;
}

function compareStringWithHash(str, hash) {
    return bcrypt.compareSync(str, hash);
}

function generateToken(payload) {
    const { username, email, mobile } = payload;
    return jwt.sign({ username, email, mobile }, process.env.SECRET_KEY, { expiresIn: EXPIRES_IN });
}

function verifyToken(token) {
    const result = jwt.verify(token, process.env.SECRET_KEY);
    if (!result?.username) throw { status: 401, message: "login to user account failed" };
    return result;
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        const filePath = `${__dirname}/../public/uploads/images/${year}/${month}/${day}`;
        fs.mkdirSync(filePath, { recursive: true });
        callback(null, filePath);
    },
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname)
        callback(null, String(Date.now()) + extension)
    }
});
const upload = multer({ storage })

module.exports = {
    hashString,
    compareStringWithHash,
    generateToken,
    verifyToken,
    upload,
}