module.exports = mongoose =>{
    return mongoose.model(
        'user',
        mongoose.Schema({
           first_name: String,
           last_name: String,
           email: String,
           password: String
        },{timestamps:false})
    );
}