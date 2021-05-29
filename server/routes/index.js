const router = require('express').Router();
const userController = require("../controllers/users.controller");

//#region for upload
const uploadController = require("../controllers/upload.controller");
const upload = require('../utils/multer');
//#endregion


const users = require('./users.routes');
const categories = require('./category.routes');
const comments = require('./comment.routes');
const memes = require('./meme.routes');

router.use('/api/users', users);
router.use('/api/category', categories);
router.use('/api/comment', comments);
router.use('/api/meme', memes);

router.post('/api/signin',userController.signin)

router.post('/api/upload/:memeId', upload.single('image'), uploadController.uploadSingleFile);
router.delete('/api/upload/:id', uploadController.deleteFile);
router.get('/api/upload/:memeId', uploadController.getAll);


router.get('/', (req, res) => {
   res.json({ message: `Welcome To Task Manager Application` });
});

module.exports = router;