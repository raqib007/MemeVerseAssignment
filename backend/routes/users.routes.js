const router = require('express').Router();
const verifySignUp = require('../middlewares/verifySignUp');
const users_controller = require('../controllers/users.controller.js');
const { authJwt } = require("../middlewares");

router.get('/',users_controller.getAll);
router.post('/:id',users_controller.getById);
router.post('/',[verifySignUp.checkDuplicateUsernameOrEmail],users_controller.create);
router.post('/:id/follow-user',[authJwt.verifyToken],users_controller.follow);
router.put('/:id',users_controller.update);
router.delete('/:id',users_controller.delete);

module.exports = router;