const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types

module.exports = mongoose =>{
    return mongoose.model(
        'user',
        mongoose.Schema({
           first_name: String,
           last_name: String,
           email: String,
           password: String,
           followers:[{type:ObjectId,ref:"user"}],
           following:[{type:ObjectId,ref:"user"}]
        //    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
        //    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
        },{timestamps:false})
    );
}