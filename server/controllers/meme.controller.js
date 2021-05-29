const ObjectId = require("mongodb").ObjectID;
const db = require('../models');
const Meme = db.memes;
const Comment = db.comments;

// Create and Save a new meme
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

    // Save meme in the database
    Meme.create(req.body)
        .then(data => {
            res.send(
                {
                    status: true,
                    httpStatusCode: 201,
                    message: "Meme successfully created.",
                    data: data
                }
            );
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                httpStatusCode: 500,
                message:
                    err.message || "Some error occurred while saving Meme."
            });
        });
};
// Update a meme by the id in the request
exports.update = (req, res) => {
    console.log(res.params);
    const id = req.params.meme_id;
    Meme.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot update Meme with id=${id}. Maybe Meme was not found!`
                });
            } else res.status(200).send({ status: true, message: "Meme was updated successfully." });
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Error updating Meme with id=" + id
            });
        });
};
// Find a single meme with an id
exports.findOne = async (req, res) => {
    const id = req.params.meme_id;
    try {
        let memes = await Meme.findById(id)
            .populate('category', { 'name': 1 })
            .populate('user_id', { 'email': 1, 'first_name': 1, 'last_name': 1 });
        let data = [];
        const comments = await Comment.find({ meme_id: new ObjectId(memes._id) , deleted:false })
                                      .populate('user_id', { 'email': 1, 'first_name': 1, 'last_name': 1 });

        data.push(Object.assign({}, memes?._doc, { comments: comments }));
        res.status(200).json(data[0]);
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while retrieving user memes."
        });
    }
};
// Retrieve all meme from the database.
exports.getAll = async (req, res) => {
    try {
        if(req.params.category === 'all' ){
            let memes = await Meme.find({})
                .populate('user_id', { 'email': 1, 'first_name': 1, 'last_name': 1 })
                .populate('category', { 'name': 1 });
            let data = [];
            for (const meme of memes) {
                const comments = await Comment.find({ meme_id: new ObjectId(meme._id) , deleted: false});
                data.push(Object.assign({}, meme?._doc, { comments: comments }));
            }
            res.status(200).json(data);
        }else{
            let memes = await Meme.find({category:req.params.category})
                .populate('user_id', { 'email': 1, 'first_name': 1, 'last_name': 1 })
                .populate('category', { 'name': 1 });
            let data = [];
            for (const meme of memes) {
                const comments = await Comment.find({ meme_id: new ObjectId(meme._id) });
                data.push(Object.assign({}, meme?._doc, { comments: comments }));
            }
            res.status(200).json(data);
        }

    } catch (error) {
        res.status(500).send({
            message:
                error.message || "Some error occurred while retrieving user memes."
        });
    }

};
// Delete a meme with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.meme_id;
    Meme.findByIdAndRemove(id, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({
                    status: false,
                    message: `Cannot delete Meme with id=${id}. Maybe Meme was not found!`
                });
            } else {
                res.send({
                    status: true,
                    message: "Meme was deleted successfully!"
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                status: false,
                message: "Could not delete Meme with id=" + id
            });
        });
};
// Like a meme with the specified id in the request
exports.like = (req, res) => {
    const id = req.params.meme_id;
    Meme.findByIdAndUpdate(id, {
        $pull: { unlikes: req.userId }
    }, {
        new: true
    }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err })
            }
            Meme.findByIdAndUpdate(id, {
                $push: { likes: req.userId }
            }, {
                new: true
            }, (error, result2) => {
                    if (error) {
                        return res.status(500).json({ error: error })
                    }
                    return res.status(200).json({ data: result2 })
                }
            )
        }
    )
};
// Dislike a meme with the specified id in the request
exports.dislike = (req, res) => {
    const id = req.params.meme_id;
    Meme.findByIdAndUpdate(id, {
        $pull: { likes: req.userId }
    }, {
        new: true
    }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: err })
            }
            Meme.findByIdAndUpdate(id, {
                $push: { unlikes: req.userId }
            }, {
                new: true
            }, (error, result2) => {
                    if (error) {
                        return res.status(500).json({ error: error })
                    }
                    return res.status(200).json({ data: result2 })
                }
            )
        }
    )
};

exports.removeLike = (req, res) => {
    const id = req.params.meme_id;
    Meme.findByIdAndUpdate(id, {
        $pull: { likes: req.userId }
    }, {
        new: true
    }, (err, result) => {
            if (err) {
                return res.status(200).json({ error: err ,success:false})
            }
            return res.status(200).json({ data: result ,success:true})
        }
    )
};

exports.removeUnlike = (req, res) => {
    const id = req.params.meme_id;
    Meme.findByIdAndUpdate(id, {
        $pull: { unlikes: req.userId }
    }, {
        new: true
    }, (err, result) => {
            if (err) {
                return res.status(200).json({ error: err ,success:false})
            }
            return res.status(200).json({ data: result ,success:true})
        }
    )
};