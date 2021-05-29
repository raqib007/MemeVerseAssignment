const db = require('../models');
const Comment = db.comments;

// Create and Save a new comment
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            status: false,
            httpStatusCode: 400,
            message: "Content can not be empty!"
        });
        return;
    }

    // Save Comment in the database
    Comment.create(req.body)
        .then(data => {
            res.send(
                {
                    status: true,
                    httpStatusCode: 201,
                    message: "Comment successfully created.",
                    data: data
                }
            );
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while saving Comments."
            });
        });
};
// Update a comment by the id in the request
exports.update = (req, res) => {
    console.log(req.params);
    const id = req.params.comment_id;
    Comment.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update Comment with id=${id}. Maybe Comment was not found!`
                });
            } else res.status(200).send({ status: true, message: "Comment was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Error updating Comment with id=" + id
            });
        });
};
// Find a single comment with an id
exports.findOne = (req, res) => {
    const id = req.params.comment_id;
    Comment.findById(id)
        .then(data => {
            if (!data)
                res.status(404).send({ message: "Not found Comment with id " + id });
            else res.status(200).send(data);
        })
        .catch(err => {
            res.status(500).send({ message: "Error retrieving Comment with id=" + id });
        });
};
// Retrieve all comment from the database.
exports.getAll = (req, res) => {
    const comment = req.query.comment;
    //var condition = name ? { comment: { $regex: new RegExp(comment), $options: "i" } } : {};
    Comment.find(null, { "name": true, "serialno": true })
        .then(data => {
            res.status(200).json(data);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving user comments."
            });
        });
};
// Delete a Comments with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.comment_id;
    Comment.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot delete Comment with id=${id}. Maybe Comment was not found!`
                });
            } else {
                res.send({
                    status: true,
                    message: "Comment was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Could not delete Comment with id=" + id
            });
        });
};
