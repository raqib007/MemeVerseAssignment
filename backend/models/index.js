const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.users = require('./user.model.js')(mongoose);
db.categories = require('./category.model.js')(mongoose);
db.memes = require('./meme.model.js')(mongoose);
db.comments = require('./comment.model.js')(mongoose);

module.exports = db;
