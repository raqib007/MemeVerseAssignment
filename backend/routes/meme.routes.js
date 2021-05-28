const router = require("express").Router();
const controller = require("../controllers/meme.controller");
const { authJwt } = require("../middlewares");

router.get("", controller.getAll);
router.get("/:meme_id", controller.findOne);
router.post("", [authJwt.verifyToken], controller.create);
router.put("/:meme_id", [authJwt.verifyToken], controller.update);
router.put("/like/:meme_id", [authJwt.verifyToken], controller.like);
router.put("/unlike/:meme_id", [authJwt.verifyToken], controller.dislike);
router.delete("/:meme_id", [authJwt.verifyToken], controller.delete);

module.exports = router;