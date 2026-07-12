const jwt = require("jsonwebtoken");

const generateToken = (user) => {

    return jwt.sign(
        {
            user_id: user.id,
            email: user.email,
            roles: user.roles
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "8h"
        }
    );

};

const verifyToken = (token) => {

    return jwt.verify(
        token,
        process.env.JWT_SECRET
    );

};

module.exports = {
    generateToken,
    verifyToken
};