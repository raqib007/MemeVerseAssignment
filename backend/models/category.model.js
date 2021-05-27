module.exports = mongoose =>{
    return mongoose.model(
        'category',
        mongoose.Schema({
            name: String
        },{timestamps:false})
    );
}