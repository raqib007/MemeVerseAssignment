const config = require("../config/auth.config");
const db = require('../models');
const User = db.users;
const Meme = db.memes;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ObjectId = require("mongodb").ObjectID;

exports.getAll = (req, res) => {
    User.find()
        .then(data => {
            res.send(data);
        })
        .catch(error => {
            res.status(500).send({ message: error.message || 'Some error occurred while retrieving users' })
        });
}

exports.getById = async (req, res) => {
    const id = req.params.id;
    try {
        let user = await User.findById(id)
            .select("-password")
            .populate('following', { 'first_name': 1, 'last_name': 1 })
            .populate('followers', { 'first_name': 1, 'last_name': 1 });

        let data = [];
        const posts = await Meme.find({ user_id: id });
        data.push(Object.assign({}, user?._doc, { posts: posts }));
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).send({
            message:
                error.message || 'Error retrieving record with id ' + id
        });
    }

    // User.findById(id)
    //     .select("-password")
    //     .populate('following', { 'first_name': 1, 'last_name': 1 })
    //     .populate('followers', { 'first_name': 1, 'last_name': 1 })
    //     .then(user => {
    //         if (!user) {
    //             res.status(404).send({ message: 'No records using id ' + id })
    //         } else {
    //             Meme.find({ user_id: id })
    //                 .exec((err, posts) => {
    //                     if (err) {
    //                         return res.status(422).json({ error: err })
    //                     }
    //                     Object.assign(user,{posts : posts})
    //                     res.status(200).json(user);
    //                 })
    //         }
    //     })
    //     .catch(error => {
    //         res.status(500).send({
    //             message: error.message || 'Error retrieving record with id ' + id
    //         })
    //     })
}

exports.create = (req, res) => {
    if (!req.body.email && !req.body.first_name && !req.body.password) {
        res.status(200).send({ success: false, message: 'Content cant be empty!' });
    }

    req.body.password = bcrypt.hashSync(req.body.password, 6);
    const user = new User(req.body);

    user.save(user)
        .then(data => {
            res.status(200).json({ success: true, data: data, message: "User successfully created.", });
        })
        .catch(error => {
            res.status(500).send({
                message:
                    error.message || "Error occurred while creating the User."
            });
        })
}
exports.update = (req, res) => {
    if (!req.body) {
        res.status(404).send({
            message: `data to can't be empty`
        });
    }

    User.findByIdAndUpdate(req.params.id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    message: 'Cant update using id ' + req.params.id + "| may be user not found"
                })
            } else {
                res.send({
                    message: 'Record updated successfully'
                });
            }
        })
        .catch(error => {
            res.status(500).send({
                message: 'Error updating user with id ' + req.params.id
            })
        });
}
exports.delete = (req, res) => {
    User.findByIdAndRemove(req.params.id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: 'Cant delete using id ' + req.params.id + "| may be user not found" })
            } else {
                res.send({ message: 'Record Deleted Successfully' });
            }
        })
        .catch(error => {
            res.status(500).send({
                message: 'Error deleting user with id ' + req.params.id
            })
        })
}
exports.follow = (req, res) => {
    // check if the requested user and :user_id is same if same then 
    const followId = req.params.id;
    const userId = req.userId;
    if (userId === followId) {
        return res.status(200).send({ success: false, message: "You cannot follow yourself!" })
    }
    User.findById(followId)
        .then(user => {
            if (user.followers.filter(follower => follower == userId).length > 0) {
                return res.status(200).send({ success: false, message: "You already followed the user" })
            }
            User.findByIdAndUpdate(followId, {
                $push: { followers: userId }
            }, {
                new: true
            }, (err, result2) => {
                if (err) {
                    return res.status(200).json({ success: false,error: err })
                }
                User.findByIdAndUpdate(userId, {
                    $push: { following: followId }
                }, { new: true }).then(result => {
                    res.status(200).json({ success: true, data: result, message: "Successful" });
                }).catch(err => {
                    return res.status(200).json({ success: false,error: err })
                })

            }
            )
        });
}
exports.unfollow = (req, res) => {
    // check if the requested user and :user_id is same if same then 
    const followId = req.params.id;
    const userId = req.userId;
    if (userId === followId) {
        return res.status(200).send({ success: false, message: "You cannot unfollow yourself!" })
    }
    User.findByIdAndUpdate(followId, {
        $pull: { followers: userId }
    }, {
        new: true
    }, (err, result2) => {
        if (err) {
            return res.status(200).json({ success: false, error: err })
        }
        User.findByIdAndUpdate(userId, {
            $pull: { following: followId }
        }, { new: true }).then(result => {
            res.status(200).json({ success: true, data: result, message: "Successful" });
        }).catch(err => {
            return res.status(200).json({ success: false, error: err })
        })
    }
    )
}
exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    })
        .exec((err, user) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            if (!user) {
                return res.status(404).json({ message: "Email or password wrong!" });
            }
            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(404).send({
                    accessToken: null,
                    message: "Invalid Password!"
                });
            }
            let tokenGeneartionData = {
                userId: user._id,
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name
            }
            var token = jwt.sign(tokenGeneartionData, config.secret, {
                algorithm: "HS512",
                // expiresIn: process.env.ACCESS_TOKEN_LIFE
                expiresIn: 86400 // 24 hours
            });
            res.status(200).send({
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                token: token
            });
        });
};