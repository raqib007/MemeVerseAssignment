const router = require("express").Router();
const controller = require("../controllers/comment.controller");
const { authJwt } = require("../middlewares");

router.get("", controller.getAll);
router.get("/:comment_id", [authJwt.verifyToken], controller.findOne);
router.post("",[authJwt.verifyToken], controller.create);
router.put("/:comment_id", [authJwt.verifyToken], controller.update);
router.delete("/:comment_id", [authJwt.verifyToken], controller.delete);

module.exports = router;