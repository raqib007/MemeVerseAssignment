const db = require("../models");
const User = db.users;

checkDuplicateUsernameOrEmail = (req, res, next) => {
    // Email
    User.findOne({
        email: req.body.email
    }).exec((err, user) => {
        if (err) {
            res.status(200).send({ message: err, success : false });
            return;
        }

        if (user) {
            res.status(200).send({ message: "Failed! Email is already in use!", success : false });
            return;
        }

        next();
    });
};

const verifySignUp = {
    checkDuplicateUsernameOrEmail
};

module.exports = verifySignUp;
