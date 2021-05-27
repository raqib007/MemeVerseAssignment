const config = require("../config/auth.config");
const db = require('../models');
const User = db.users;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.getAll = (req, res) => {
   User.find()
      .then(data => {
         res.send(data);
      })
      .catch(error => {
         res.status(500).send({ message: error.message || 'Some error occurred while retrieving users' })
      });
}

exports.getById = (req, res) => {
   const id = req.params.id;
   User.findById(id)
      .then(data => {
         if (!data) {
            res.status(404).send({ message: 'No records using id ' + id })
         } else {
            res.send(data);
         }
      })
      .catch(error => {
         res.status(500).send({
            message: error.message || 'Error retrieving record with id ' + id
         })
      })
}

exports.create = (req, res) => {
   if (!req.body.email && !req.body.first_name && !req.body.password) {
      res.status(400).send({ status:false, message: 'Content cant be empty!' });
   }

   req.body.password = bcrypt.hashSync(req.body.password, 6);
   const user = new User(req.body);

   user.save(user)
      .then(data => {
         res.status(200).json({ success: true, data: data,message: "User successfully created.", });
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
             return res.status(404).send({ message: "Email or password wrong!" });
          }
          var passwordIsValid = bcrypt.compareSync(
              req.body.password,
              user.password
          );

          if (!passwordIsValid) {
             return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
             });
          }
          let tokenGeneartionData = {
             id: user._id,
             email: user.email
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