
const mongoose = require("mongoose");

const db = require("../models");
const Category = db.categories;

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log("MongoDB connected.");
        initial();
    } catch (error) {
        console.error(error.message);
        process.exit(1);
    }
};
module.exports = connectDB;


function initial() {
    Category.estimatedDocumentCount((err, count) => {
        if (!err && count === 0) {
            new Category({
                name: "Funny"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }
                console.log("added 'Funny' to roles collection");
            });

            new Category({
                name: "Awesome"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'Awesome' to roles collection");
            });

            new Category({
                name: "Savage"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'Savage' to roles collection");
            });

            new Category({
                name: "Meme"
            }).save(err => {
                if (err) {
                    console.log("error", err);
                }

                console.log("added 'Meme' to roles collection");
            });
        }
    });
}