
module.exports = mongoose =>{
    return mongoose.model(
        'user',
        mongoose.Schema({
           first_name: String,
           last_name: String,
           email: String,
           password: String,
           following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
           followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
        },{timestamps:false})
    );
}