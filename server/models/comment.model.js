module.exports = mongoose =>{
    return mongoose.model(
        'comment',
        mongoose.Schema({
            parent_id: String,
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            meme_id: { type: mongoose.Schema.Types.ObjectId, ref: 'meme' },
            comment: String,
            deleted: {
                type: Boolean,
                default: false
            }
        },{timestamps:true})
    )
}