const db = require("../models");
const User = db.users;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Email
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err, status : false });
            return;
        }

        if (user) {
            res.status(400).send({ message: "Failed! Email is already in use!", status : false });
            return;
        }

        next();
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
