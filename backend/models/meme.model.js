module.exports = mongoose => {
    return mongoose.model(
        'meme',
        mongoose.Schema({
            user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
            description: String,
            category: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
            image_public_id: String,
            image_url: String,
            likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
            unlikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
        },{timestamps:true}))
}